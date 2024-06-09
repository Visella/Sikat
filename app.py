from flask import Flask, jsonify, render_template, request, make_response
import requests
import base64
import random
import azure.cognitiveservices.speech as speechsdk

app = Flask(__name__)

subscription_key = '3d6d68afa8724ee79bd9ba8c6fd68b98'
region = "eastus"
language = "en-US"
voice = "Microsoft Server Speech Text to Speech Voice (en-US, JennyNeural)"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/readalong")
def readalong():
    return render_template("readalong.html")

@app.route("/gettoken", methods=["POST"])
def gettoken():
    fetch_token_url = f'https://{region}.api.cognitive.microsoft.com/sts/v1.0/issueToken'
    headers = {'Ocp-Apim-Subscription-Key': subscription_key}
    response = requests.post(fetch_token_url, headers=headers)
    access_token = response.text
    return jsonify({"at": access_token})

@app.route("/gettonguetwister", methods=["POST"])
def gettonguetwister():
    tonguetwisters = [
        "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
        "She sells seashells by the seashore.",
        # Add more tongue twisters as needed
    ]
    return jsonify({"tt": random.choice(tonguetwisters)})

@app.route("/getstory", methods=["POST"])
def getstory():
    id = int(request.form.get("id"))
    stories = [
        # Add your stories here
    ]
    if id >= len(stories):
        return jsonify({"code": 201})
    else:
        return jsonify({"code": 200, "storyid": id, "storynumelements": len(stories[id]), "story": stories[id]})

@app.route("/ackaud", methods=["POST"])
def ackaud():
    f = request.files['audio_data']
    reftext = request.form.get("reftext")

    def get_chunk(audio_source, chunk_size=1024):
        while True:
            chunk = audio_source.read(chunk_size)
            if not chunk:
                break
            yield chunk

    referenceText = reftext
    pronAssessmentParamsJson = f'{{"ReferenceText":"{referenceText}","GradingSystem":"HundredMark","Dimension":"Comprehensive","EnableMiscue":"True"}}'
    pronAssessmentParamsBase64 = base64.b64encode(bytes(pronAssessmentParamsJson, 'utf-8'))
    pronAssessmentParams = str(pronAssessmentParamsBase64, "utf-8")

    url = f'https://{region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language={language}&usePipelineVersion=0'
    headers = {
        'Accept': 'application/json;text/xml',
        'Connection': 'Keep-Alive',
        'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
        'Ocp-Apim-Subscription-Key': subscription_key,
        'Pronunciation-Assessment': pronAssessmentParams,
        'Transfer-Encoding': 'chunked',
        'Expect': '100-continue'
    }

    audioFile = f
    response = requests.post(url=url, data=get_chunk(audioFile), headers=headers)
    audioFile.close()
    return response.json()

@app.route("/gettts", methods=["POST"])
def gettts():
    reftext = request.form.get("reftext")
    speech_config = speechsdk.SpeechConfig(subscription=subscription_key, region=region)
    speech_config.speech_synthesis_voice_name = voice

    offsets = []

    def wordbound(evt):
        offsets.append(evt.audio_offset / 10000)

    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)
    speech_synthesizer.synthesis_word_boundary.connect(wordbound)

    result = speech_synthesizer.speak_text_async(reftext).get()
    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        audio_data = result.audio_data
        response = make_response(audio_data)
        response.headers['Content-Type'] = 'audio/wav'
        response.headers['Content-Disposition'] = 'attachment; filename=sound.wav'
        response.headers['offsets'] = offsets
        return response
    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            return jsonify({"success": False, "error": cancellation_details.error_details})

@app.route("/getttsforword", methods=["POST"])
def getttsforword():
    word = request.form.get("word")
    speech_config = speechsdk.SpeechConfig(subscription=subscription_key, region=region)
    speech_config.speech_synthesis_voice_name = voice

    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)
    result = speech_synthesizer.speak_text_async(word).get()
    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        audio_data = result.audio_data
        response = make_response(audio_data)
        response.headers['Content-Type'] = 'audio/wav'
        response.headers['Content-Disposition'] = 'attachment; filename=sound.wav'
        return response
    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            return jsonify({"success": False, "error": cancellation_details.error_details})

if __name__ == "__main__":
    app.run(debug=True)
