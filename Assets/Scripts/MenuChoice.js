#pragma strict

function MenuChoice (item :int) {
	if (item == 1) {
		SceneManagement.SceneManager.LoadScene("Backstory");
	} else if (item == 4) {
		Application.Quit();
	}
}