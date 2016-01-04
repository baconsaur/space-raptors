#pragma strict

var storyText :String[];
var UIText :UnityEngine.UI.Text;

private var currentLine :int;
private var keyPress :boolean;

function Start () {
	currentLine = 0;
	Next();
}

function Update () {
	if (Input.anyKey) {
		if (!keyPress) {
			KeyPressed();
		}
	}
}

function AnimateText (text :String) {
	for (var i=0;i<text.length;i++) {
		UIText.text += text[i];
		yield WaitForSeconds(0.05);
	}
	currentLine++;
	yield WaitForSeconds(1);
	Next();
}

function KeyPressed () {
	keyPress = true;
	StopCoroutine("AnimateText");
	if (UIText.text.length < storyText[currentLine].length) {
		UIText.text = storyText[currentLine];
		yield WaitForSeconds(1);
	}
	currentLine++;
	Next();
}

function Next () {
	keyPress = false;
	if (currentLine < storyText.length) {
		UIText.text = "";
		StartCoroutine("AnimateText", storyText[currentLine]);
	} else {
		SceneManagement.SceneManager.LoadScene("Main");
	}
}