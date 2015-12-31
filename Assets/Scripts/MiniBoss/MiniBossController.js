#pragma strict

var health :int;
//var shotOffset :Vector2;
//var defaultCooldown :int;
//var animator :Animator;


//private var player :GameObject;
private var totalHealth :int;
private var stage :int;

function Start () {
//	player = GameObject.Find('Player');
	totalHealth = health;
	SetStage();
}

function TakeDamage (damage :int) {
	health -= damage;
	if (health <= 0) {
		Destroy(gameObject);
	} else {
		this.gameObject.SendMessage('DisplayDamage');
		//Shriek();
		SetStage();
	}
}

function SetStage() {
	var newStage :int = 4 - Mathf.Round(health * 3 / totalHealth);
	if (stage != newStage) {
		stage = newStage;
		switch(stage) {
			case 1:
				Debug.Log('Stage 1');
				this.gameObject.GetComponent(FollowAI).getem = true;
				break;
			case 2:
				Debug.Log('Stage 2');

				break;
			case 3:
				Debug.Log('Stage 3');

				break;
			default:
				Debug.Log('Inappropriate Stage Set');
		}
	}
}