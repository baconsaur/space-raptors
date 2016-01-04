#pragma strict

private var player :GameObject;

function Start () {
	Time.timeScale = 0;
	player = GameObject.Find("Player");
}

function MenuChoice (item :int) {
	if (item == 1) {
		Time.timeScale = 1;
		player.GetComponent(PlayerController).paused = false;
		Destroy(gameObject);
	} else if (item == 3) {
		SceneManagement.SceneManager.LoadScene("Menu");
	} else if (item == 4) {
		Application.Quit();
	}
}