
from flask import Flask, request, send_file, render_template, jsonify
import tempfile
import os
from mistralai import Mistral
from openai import OpenAI
import pandas as pd
from assistant import interact_once
trade = pd.read_csv("trade.csv")
bank = pd.read_csv("bank.csv")

app = Flask(__name__)

# Init clients
openai_client = OpenAI(api_key="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")
mistral_client = Mistral(api_key="OAUu8uJckfaPMT2AOQ1pH0j1kB7ppbwE")

MODEL_MISTRAL = "mistral-large-latest"
user = "0bf3b550-dc5b-4f3e-91f4-162b687b97c6"

@app.route("/data", methods=["GET"])
def data():
    return({"trade":trade[trade["userId"]==user].to_json(orient="records"),"bank":bank[bank["userId"]==user].to_json(orient="records")})

@app.route("/voice", methods=["POST"])
def handle_voice():
    audio_file = request.files["audio"]
    context = request.form.get("page_text", "")
    mode = request.form.get("gen_z_mode", "normal")
    print(request.form)
    print(mode)
    #print(len(audio_file.read()))

    # Save audio
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
        audio_path = tmp.name
        audio_file.save(audio_path)
        print(audio_path)

    interact_once(audio_path,context,mode)
    out_path = "output.mp3"

    return send_file(out_path, mimetype="audio/mpeg")


@app.route("/plot", methods=["POST"])
def plot():
    topic = request.form.get("topic", "")
    chat_response = mistral_client.chat.complete(
        model=MODEL_MISTRAL,
        messages=[
            {"role": "system", "content": "Generate valid JavaScript code that plots what the user asks for."},
            {"role": "user", "content": topic},
        ],
        temperature=0,
        max_tokens=400
    )
    return jsonify({"response": chat_response.choices[0].message.content})


@app.route("/")
def hello_world():
    return render_template("index.html")


if __name__ == "__main__":
    app.run("0.0.0.0", 8078)
