import os
import io
import base64
import traceback
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
import pickle
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
try:
    import plotly.graph_objs as go
    from plotly.io import to_html
except Exception:
    go = None
    def to_html(*args, **kwargs):
        return "<div>Plotly not available on server.</div>"
try:
    from tensorflow.keras.models import load_model  
except Exception: 
    load_model = None 
app = Flask(__name__)
CORS(app)

def generate_dummy_ocean_data():
    """Generates a sample DataFrame for oceanographic data."""
    data = {
        'sample_id': range(1, 101),
        'date': pd.to_datetime(pd.date_range(start='2023-01-01', periods=100, freq='D')),
        'time': pd.date_range(start='2023-01-01', periods=100, freq='H').strftime('%H:%M'),
        'lat': np.random.uniform(20, 40, 100),
        'lon': np.random.uniform(-100, -80, 100),
        'depth_m': np.random.uniform(0, 50, 100),
        'temperature_C': np.random.uniform(15, 25, 100) + np.sin(np.linspace(0, 2*np.pi, 100)) * 2,
        'salinity_PSU': np.random.uniform(30, 35, 100) - np.cos(np.linspace(0, 2*np.pi, 100)) * 1,
        'oxygen_mgL': np.random.uniform(5, 10, 100),
        'pH': np.random.uniform(7.5, 8.5, 100)
    }
    return pd.DataFrame(data)

def generate_dummy_fisheries_data():
    """Generates a sample DataFrame for fisheries data."""
    species = ['Sardina pilchardus', 'Engraulis encrasicolus', 'Merluccius merluccius']
    life_stages = ['juvenile', 'adult']
    data = {
        'sample_id': range(1, 101),
        'date': pd.to_datetime(pd.date_range(start='2023-01-01', periods=100, freq='D')),
        'lat': np.random.uniform(20, 40, 100),
        'lon': np.random.uniform(-100, -80, 100),
        'species_scientific': np.random.choice(species, 100),
        'count': np.random.randint(10, 500, 100),
        'avg_length_mm': np.random.uniform(50, 300, 100),
        'life_stage': np.random.choice(life_stages, 100)
    }
    return pd.DataFrame(data)

MODEL_PATH = 'otolith_classifier.h5'
model = None
SPECIES_LABELS = ['Sardina pilchardus', 'Engraulis encrasicolus', 'Merluccius merluccius']

FISH_MODEL_PKL = 'model-fish.pkl'
OCEAN_MODEL_PKL = 'model-ocean.pkl'
fish_model = None
ocean_model = None

if os.path.exists(MODEL_PATH) and load_model is not None:
    try:
        model = load_model(MODEL_PATH)
        print("Pre-trained model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {str(e)}")
else:
    if load_model is None:
        print("Warning: TensorFlow not available. AI prediction API will be unavailable.")
    else:
        print("Warning: 'otolith_classifier.h5' not found. AI prediction API will be unavailable.")

if os.path.exists(FISH_MODEL_PKL):
    try:
        with open(FISH_MODEL_PKL, 'rb') as f:
            fish_model = pickle.load(f)
        print("Fish model loaded from model-fish.pkl")
    except Exception as e:
        print(f"Error loading fish model: {e}")
else:
    print("Info: 'model-fish.pkl' not found.")

if os.path.exists(OCEAN_MODEL_PKL):
    try:
        with open(OCEAN_MODEL_PKL, 'rb') as f:
            ocean_model = pickle.load(f)
        print("Ocean model loaded from model-ocean.pkl")
    except Exception as e:
        print(f"Error loading ocean model: {e}")
else:
    print("Info: 'model-ocean.pkl' not found.")

@app.route('/api/oceanographic_data', methods=['POST'])
def process_ocean_data():
    """
    Handles data upload, cleaning, and returns processed oceanographic data.
    """
    try:
        if 'file' in request.files and request.files['file'].filename != '':
            file = request.files['file']
            if file.filename.endswith('.csv'):
                df = pd.read_csv(file)
            elif file.filename.endswith('.xlsx'):
                df = pd.read_excel(file)
            else:
                return jsonify({"error": "Unsupported file type. Please upload a CSV or Excel file."}), 400
        else:
            df = generate_dummy_ocean_data()

        for col in ['temperature_C', 'salinity_PSU', 'oxygen_mgL', 'pH', 'depth_m']:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
                df[col] = df[col].fillna(df[col].mean())
        
        if 'date' in df.columns:
            df['date'] = df['date'].dt.strftime('%Y-%m-%d')
        if 'time' in df.columns:
            df['time'] = df['time'].astype(str)
            
        return jsonify(df.to_dict(orient='records'))

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/api/fisheries_data', methods=['POST'])
def process_fisheries_data():
    """
    Handles data upload, cleaning, and returns processed fisheries data,
    simulating a cross-domain join with oceanographic data.
    """
    try:
        if 'file' in request.files and request.files['file'].filename != '':
            file = request.files['file']
            if file.filename.endswith('.csv'):
                df = pd.read_csv(file)
            elif file.filename.endswith('.xlsx'):
                df = pd.read_excel(file)
            else:
                return jsonify({"error": "Unsupported file type. Please upload a CSV or Excel file."}), 400
        else:
            df = generate_dummy_fisheries_data()
            
        df['temperature_C'] = np.random.uniform(15, 25, len(df))
        df['salinity_PSU'] = np.random.uniform(30, 35, len(df))

        if 'date' in df.columns:
            df['date'] = df['date'].dt.strftime('%Y-%m-%d')
            
        return jsonify(df.to_dict(orient='records'))

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/api/predict_species', methods=['POST'])
def predict_species():
    """
    Accepts an image, pre-processes it, and uses the AI model to predict the species.
    """
    if model is None:
        return jsonify({"error": "AI model not available. Please train and save 'otolith_classifier.h5'."}), 503

    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided."}), 400
        
        file = request.files['image']
        img = Image.open(io.BytesIO(file.read())).convert('RGB')
        img = img.resize((128, 128))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        predictions = model.predict(img_array)[0]
        
        predicted_class_index = np.argmax(predictions)
        predicted_species = SPECIES_LABELS[predicted_class_index]
        confidence = float(predictions[predicted_class_index])
        
        return jsonify({
            "predicted_species": predicted_species,
            "confidence": confidence
        })

    except Exception as e:
        return jsonify({"error": f"An error occurred during prediction: {str(e)}"}), 500

@app.route('/api/predict_fish', methods=['POST'])
def predict_fish():
    """Predict using fish model (model-fish.pkl). Accepts JSON {features:[...]},
    or CSV/Excel file under 'file'. Returns predictions array."""
    if fish_model is None:
        return jsonify({"error": "Fish model not available."}), 503

    try:
        if 'file' in request.files and request.files['file'].filename != '':
            file = request.files['file']
            if file.filename.endswith('.csv'):
                df = pd.read_csv(file)
            elif file.filename.endswith('.xlsx'):
                df = pd.read_excel(file)
            else:
                return jsonify({"error": "Unsupported file type. Upload CSV/XLSX."}), 400

            df = _normalize_ocean_columns(df)

            required_features = ['temperature_C', 'salinity_PSU', 'oxygen_mgL', 'pH', 'depth_m']
            missing = [f for f in required_features if f not in df.columns]
            if missing:
                return jsonify({"error": f"Missing required columns: {missing}"}), 400

            X = df[required_features].values
            preds = _safe_predict(fish_model, X)
            return jsonify({
                "predictions": preds.tolist(),
                "count": len(preds)
            })

        payload = request.get_json(silent=True) or {}
        features = payload.get('features')
        if features is None:
            return jsonify({"error": "Provide 'features': [..] in JSON or upload a CSV/XLSX file."}), 400
        X = np.array(features, dtype=float).reshape(1, -1)
        preds = _safe_predict(fish_model, X)
        return jsonify({"prediction": float(preds[0]) if preds.ndim == 1 else preds[0]})
    except Exception as e:
        return jsonify({"error": f"Fish prediction failed: {str(e)}"}), 500


@app.route('/api/predict_ocean', methods=['POST'])
def predict_ocean():
    """Predict using ocean model (model-ocean.pkl) and return charts or a single prediction."""
    if ocean_model is None:
        return jsonify({"error": "Ocean model not available."}), 503

    required_features = ["temperature_C", "salinity_PSU", "oxygen_mgL", "pH", "depth_m"]

    try:
        if 'file' in request.files and request.files['file'].filename != '':
            file = request.files['file']
            if file.filename.endswith('.csv'):
                df = pd.read_csv(file)
            elif file.filename.endswith('.xlsx') or file.filename.endswith('.xls'):
                df = pd.read_excel(file, engine='openpyxl')
            else:
                return jsonify({"error": "Unsupported file type. Upload CSV/XLSX."}), 400

            df = _normalize_ocean_columns(df)

            missing = [f for f in required_features if f not in df.columns]
            if missing:
                return jsonify({"error": f"Missing required columns: {missing}"}), 400

            X = df[required_features].apply(pd.to_numeric, errors='coerce').fillna(0.0).values
            preds = _safe_predict(ocean_model, X)
            df['Prediction'] = preds if getattr(preds, 'ndim', 1) == 1 else preds.flatten()
            charts = {}
            if go is not None:
                fig1 = go.Figure([go.Scatter(
                    x=df['depth_m'], y=df['Prediction'], mode='markers',
                    marker=dict(color=df['Prediction'], colorscale='Turbo', showscale=True)
                )])
                fig1.update_layout(title='Predictions vs Depth', xaxis_title='Depth (m)', yaxis_title='Prediction')
                charts['scatter'] = to_html(fig1, include_plotlyjs=False, full_html=False)

                # Trend line
                fig2 = go.Figure([go.Scatter(y=df['Prediction'], mode='lines+markers')])
                fig2.update_layout(title='Prediction Trend', xaxis_title='Index', yaxis_title='Prediction')
                charts['trend'] = to_html(fig2, include_plotlyjs=False, full_html=False)

            return jsonify({
                "count": int(len(df)),
                "charts": charts,
                "sample": df.head(20).fillna('').to_dict(orient='records')
            })

        payload = request.get_json(silent=True) or {}
        features = payload.get('features')
        if features is None:
            return jsonify({"error": "No file uploaded and no JSON 'features' provided."}), 400

        if len(features) != len(required_features):
            return jsonify({
                "error": f"Expected {len(required_features)} features: {required_features}, but got {len(features)}"
            }), 400

        X = np.array(features, dtype=float).reshape(1, -1)
        preds = _safe_predict(ocean_model, X)
        pred_value = float(preds[0]) if getattr(preds, 'ndim', 1) == 1 else float(preds.flatten()[0])
        return jsonify({"prediction": pred_value, "features_order": required_features})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

def _safe_predict(model_obj, X: np.ndarray) -> np.ndarray:
    """Try predict_proba then predict; return numpy array of outputs."""
    try:
        if hasattr(model_obj, 'predict_proba'):
            proba = model_obj.predict_proba(X)
            return np.array(proba)
    except Exception:
        pass
    preds = model_obj.predict(X)
    return np.array(preds)

@app.route('/upload_integration1', methods=['POST'])
def upload_integration1():
    """Oceanographic: accept CSV/XLSX, clean, compute summaries, return Plotly charts HTML and data sample."""
    try:
        if 'file' not in request.files or request.files['file'].filename == '':
            return jsonify({"error": "No file uploaded."}), 400
        file = request.files['file']
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.filename.endswith('.xlsx') or file.filename.endswith('.xls'):
            df = pd.read_excel(file, engine='openpyxl')
        else:
            return jsonify({"error": "Unsupported file type. Upload CSV/XLSX."}), 400

        df = _normalize_ocean_columns(df)
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'], errors='coerce')
        ts = df.dropna(subset=['date']).sort_values('date')

        charts = {}
        if go is not None:
            fig_ts = go.Figure()
            fig_ts.add_trace(go.Scatter(x=ts['date'], y=ts['temperature_C'], mode='lines', name='Temperature (°C)'))
            fig_ts.update_layout(title='Temperature over Time', xaxis_title='Date', yaxis_title='°C', template='plotly_white')
            charts['time_series'] = to_html(fig_ts, include_plotlyjs=False, full_html=False)

   
            fig_depth = go.Figure()
            fig_depth.add_trace(go.Histogram(x=df['depth_m'].dropna(), nbinsx=20, name='Depth (m)'))
            fig_depth.update_layout(title='Depth Distribution', xaxis_title='Depth (m)', yaxis_title='Count', template='plotly_white')
            charts['depth_hist'] = to_html(fig_depth, include_plotlyjs=False, full_html=False)

          
            fig_spatial = go.Figure()
            fig_spatial.add_trace(go.Scattergl(x=df['lon'], y=df['lat'], mode='markers',
                                               marker=dict(color=df['temperature_C'], colorscale='Turbo', showscale=True),
                                               text=df['sample_id']))
            fig_spatial.update_layout(title='Spatial Distribution (colored by Temp)', xaxis_title='Longitude', yaxis_title='Latitude', template='plotly_white')
            charts['spatial'] = to_html(fig_spatial, include_plotlyjs=False, full_html=False)

        summary = {
            'total_samples': int(df.shape[0]),
            'avg_temp': float(df['temperature_C'].mean(skipna=True)) if df['temperature_C'].notna().any() else None,
            'avg_depth': float(df['depth_m'].mean(skipna=True)) if df['depth_m'].notna().any() else None,
            'date_min': ts['date'].min().strftime('%Y-%m-%d') if not ts.empty else None,
            'date_max': ts['date'].max().strftime('%Y-%m-%d') if not ts.empty else None,
        }
        sample = df.head(50).fillna('').to_dict(orient='records')
        return jsonify({
            'summary': summary,
            'charts': charts,
            'sample': sample
        })
    except Exception as e:
        return jsonify({"error": f"Integration1 processing failed: {str(e)}"}), 500


@app.route('/upload_integration2', methods=['POST'])
def upload_integration2():
    """Fisheries: accept CSV/XLSX, clean, compute summaries, return Plotly charts HTML and data sample."""
    try:
        if 'file' not in request.files or request.files['file'].filename == '':
            return jsonify({"error": "No file uploaded."}), 400
        file = request.files['file']
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.filename.endswith('.xlsx') or file.filename.endswith('.xls'):
            df = pd.read_excel(file, engine='openpyxl')
        else:
            return jsonify({"error": "Unsupported file type. Upload CSV/XLSX."}), 400

    
        df = _normalize_fisheries_columns(df)
  
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'], errors='coerce')

        charts = {}
        if go is not None:
            abundance = df.groupby('species_scientific', dropna=True)['count'].sum().sort_values(ascending=False).head(15)
            fig_abund = go.Figure([go.Bar(x=abundance.index.astype(str), y=abundance.values)])
            fig_abund.update_layout(title='Species Abundance', xaxis_title='Species', yaxis_title='Total Count', template='plotly_white')
            charts['abundance'] = to_html(fig_abund, include_plotlyjs=False, full_html=False)

            fig_len = go.Figure([go.Histogram(x=df['avg_length_mm'].dropna(), nbinsx=25)])
            fig_len.update_layout(title='Length Distribution (mm)', xaxis_title='Avg Length (mm)', yaxis_title='Count', template='plotly_white')
            charts['length_dist'] = to_html(fig_len, include_plotlyjs=False, full_html=False)

   
            ts = df.dropna(subset=['date']).copy()
            ts['month'] = ts['date'].dt.to_period('M').dt.to_timestamp()
            monthly = ts.groupby('month')['count'].sum().reset_index()
            fig_trend = go.Figure([go.Scatter(x=monthly['month'], y=monthly['count'], mode='lines+markers')])
            fig_trend.update_layout(title='Fish Count Over Time', xaxis_title='Month', yaxis_title='Count', template='plotly_white')
            charts['trend'] = to_html(fig_trend, include_plotlyjs=False, full_html=False)

        summary = {
            'total_samples': int(df.shape[0]),
            'unique_species': int(df['species_scientific'].nunique(dropna=True)),
            'total_fish': int(df['count'].sum(skipna=True)) if df['count'].notna().any() else 0,
            'avg_length': float(df['avg_length_mm'].mean(skipna=True)) if df['avg_length_mm'].notna().any() else None,
        }
        sample = df.head(50).fillna('').to_dict(orient='records')
        return jsonify({'summary': summary, 'charts': charts, 'sample': sample})
    except Exception as e:
        return jsonify({"error": f"Integration2 processing failed: {str(e)}"}), 500

def _clean_columns(df: pd.DataFrame) -> pd.DataFrame:
    def norm(c: str) -> str:
        c = str(c).strip().lower()
        replacements = {
            '(': '', ')': '', '/': '_', '\\': '_', '-': '_', ' ': '_', '%': 'pct'
        }
        for k, v in replacements.items():
            c = c.replace(k, v)
        return c
    df = df.copy()
    df.columns = [norm(c) for c in df.columns]
    return df


def _normalize_ocean_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = _clean_columns(df)
    mapping = {
        'sample_id': ['sample_id', 'id', 'sampleid'],
        'date': ['date', 'sampling_date', 'sample_date'],
        'time': ['time', 'sampling_time', 'sample_time'],
        'lat': ['lat', 'latitude'],
        'lon': ['lon', 'longitude'],
        'depth_m': ['depth_m', 'depth', 'depth_meter', 'depth_meters'],
        'temperature_c': ['temperature_c', 'temperature', 'temp_c', 'temp'],
        'salinity_psu': ['salinity_psu', 'salinity'],
        'oxygen_mgl': ['oxygen_mgl', 'dissolved_oxygen_mg_l', 'do_mg_l', 'oxygen'],
        'ph': ['ph']
    }
    df = _apply_mapping(df, mapping)
    for col in ['temperature_c', 'salinity_psu', 'oxygen_mgl', 'ph', 'depth_m', 'lat', 'lon']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
    for col in ['sample_id','date','time','lat','lon','depth_m','temperature_c','salinity_psu','oxygen_mgl','ph']:
        if col not in df.columns:
            df[col] = np.nan
    df = df.rename(columns={'temperature_c': 'temperature_C', 'salinity_psu': 'salinity_PSU', 'oxygen_mgl': 'oxygen_mgL'})
    return df


def _normalize_fisheries_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = _clean_columns(df)
    mapping = {
        'sample_id': ['sample_id', 'id', 'sampleid'],
        'date': ['date', 'sampling_date', 'sample_date'],
        'lat': ['lat', 'latitude'],
        'lon': ['lon', 'longitude'],
        'species_scientific': ['species_scientific', 'species', 'scientific_name'],
        'count': ['count', 'fish_count', 'n'],
        'avg_length_mm': ['avg_length_mm', 'avg_length', 'length_mm', 'mean_length_mm'],
        'life_stage': ['life_stage', 'stage']
    }
    df = _apply_mapping(df, mapping)
    for col in ['count', 'avg_length_mm', 'lat', 'lon']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
    for col in ['sample_id','date','lat','lon','species_scientific','count','avg_length_mm','life_stage']:
        if col not in df.columns:
            df[col] = np.nan
    return df


def _apply_mapping(df: pd.DataFrame, mapping: dict) -> pd.DataFrame:
    col_map = {}
    cols = set(df.columns)
    for target, aliases in mapping.items():
        for a in aliases:
            if a in cols:
                col_map[a] = target
                break
    return df.rename(columns=col_map)

@app.route("/")
def index():
    return "✅ Flask is running! Use integration1.html or integration2.html frontend files."


# --- Main entry point ---
if __name__ == '__main__':
    app.run(debug=True)

# --- New: ML Analysis Route ---
@app.route('/upload_ml_analysis', methods=['POST'])
def upload_ml_analysis():
    try:
        if 'file' not in request.files or request.files['file'].filename == '':
            return jsonify({"error": "No file uploaded."}), 400

        file = request.files['file']
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.filename.endswith('.xlsx') or file.filename.endswith('.xls'):
            df = pd.read_excel(file, engine='openpyxl')
        else:
            return jsonify({"error": "Unsupported file type. Upload CSV/XLSX."}), 400
        df = df.dropna(how='any')
        if 'date' in df.columns:
            try:
                df['date'] = pd.to_datetime(df['date'], errors='coerce')
            except Exception:
                pass
        col_map = {
            'Temperature': ['temperature', 'temp', 'temperature_c', 'temperature_C'],
            'Salinity': ['salinity', 'salinity_psu', 'salinity_PSU'],
            'Oxygen': ['oxygen', 'oxygen_mgl', 'oxygen_mgL', 'do_mg_l'],
            'Turbidity': ['turbidity'],
            'Depth': ['depth', 'depth_m'],
            'Chlorophyll': ['chlorophyll', 'chlorophyll_a', 'chl_a']
        }

        def find_col(dfcols, aliases):
            lower = {c.lower(): c for c in dfcols}
            for a in aliases:
                if a.lower() in lower:
                    return lower[a.lower()]
            return None

        resolved = {}
        for target, aliases in col_map.items():
            resolved[target] = find_col(df.columns, aliases) or target if target in df.columns else None

        required = ["Temperature", "Salinity", "Oxygen", "Turbidity", "Depth", "Chlorophyll"]
        missing = [k for k in required if not resolved.get(k)]
        if missing:
            return jsonify({"error": f"Missing required columns: {missing}"}), 400

        X = df[[resolved['Temperature'], resolved['Salinity'], resolved['Oxygen'], resolved['Turbidity'], resolved['Depth']]].apply(pd.to_numeric, errors='coerce').dropna()
        y = pd.to_numeric(df[resolved['Chlorophyll']], errors='coerce').loc[X.index]

        if len(X) < 10:
            return jsonify({"error": "Not enough rows after cleaning to train the model (need >= 10)."}), 400

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        model = LinearRegression()
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)

        r2 = float(r2_score(y_test, y_pred))
        rmse = float(mean_squared_error(y_test, y_pred, squared=False))

        def fig_to_base64(fig):
            buf = io.BytesIO()
            fig.savefig(buf, format='png', bbox_inches='tight')
            plt.close(fig)
            buf.seek(0)
            return base64.b64encode(buf.read()).decode('utf-8')

        charts = {}
        if 'date' in df.columns and resolved['Temperature'] in df.columns:
            try:
                temp_df = df[["date", resolved['Temperature']]].dropna()
                temp_df = temp_df.sort_values('date')
                fig, ax = plt.subplots(figsize=(7, 4))
                ax.plot(temp_df['date'], temp_df[resolved['Temperature']], color='#1f77b4')
                ax.set_title('Temperature over Time')
                ax.set_xlabel('Date')
                ax.set_ylabel('Temperature')
                fig.autofmt_xdate()
                charts['temp_time'] = fig_to_base64(fig)
            except Exception:
                pass

        try:
            corr_cols = [resolved['Temperature'], resolved['Salinity'], resolved['Oxygen'], resolved['Turbidity'], resolved['Depth'], resolved['Chlorophyll']]
            corr_df = df[corr_cols].apply(pd.to_numeric, errors='coerce').dropna()
            if not corr_df.empty:
                fig, ax = plt.subplots(figsize=(6, 5))
                sns.heatmap(corr_df.corr(), annot=True, cmap='coolwarm', ax=ax, fmt='.2f')
                ax.set_title('Correlation Heatmap')
                charts['corr'] = fig_to_base64(fig)
        except Exception:
            pass

     
        try:
            fig, ax = plt.subplots(figsize=(6, 5))
            ax.scatter(y_test, y_pred, alpha=0.7, color='#2ca02c')
            min_val = float(min(y_test.min(), y_pred.min()))
            max_val = float(max(y_test.max(), y_pred.max()))
            ax.plot([min_val, max_val], [min_val, max_val], 'r--')
            ax.set_xlabel('Actual Chlorophyll')
            ax.set_ylabel('Predicted Chlorophyll')
            ax.set_title('Predicted vs Actual')
            charts['scatter'] = fig_to_base64(fig)
        except Exception:
            pass

        return jsonify({
            "metrics": {"r2": r2, "rmse": rmse},
            "charts": charts
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500