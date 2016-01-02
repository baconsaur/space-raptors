#pragma strict

var health :int;
//var shotOffset :Vector2;
//var defaultCooldown :int;
//var animator :Animator;


//private var player :GameObject;
private var totalHealth :int;
private var stage :int;
private var player :GameObject;
private var follow :FollowAI;
private var melee :MeleeAttack;
private var mainCannon :MainCannon;


function Start () {
	player = GameObject.Find('Player');
	totalHealth = health;
	follow = GetComponent(FollowAI);
	mainCannon = GetComponent(MainCannon);
	melee = GetComponent(MeleeAttack);
	follow.enabled = false;
	mainCannon.enabled = false;
	SetStage();
}

function FixedUpdate() {
	if (player.GetComponent(PlayerController).health <= 0) {
		follow.getem = false;
		melee.smackem = false;
		mainCannon.shootem = false;
	}
}

function TakeDamage (damage :int) {
	health -= damage;
	if (health <= 0) {
		Destroy(this.gameObject);
	} else {
		this.gameObject.SendMessage('DisplayDamage');
		SetStage();
	}
}

function SetStage() {
	var newStage :int = Mathf.Round(4f - (health * 3f / totalHealth));
	if (stage != newStage) {
		stage = newStage;
		switch(stage) {
			case 1:
				Debug.Log('Stage 1');
				follow.enabled = true;
				follow.getem = true;
				break;
			case 2:
				Debug.Log('Stage 2');
				mainCannon.enabled = true;
				mainCannon.shootem = true;
				break;
			case 3:
				Debug.Log('Stage 3');
				mainCannon.destroyem = true;
				break;
			default:
				Debug.Log('Inappropriate Stage Set');
		}
	}
}