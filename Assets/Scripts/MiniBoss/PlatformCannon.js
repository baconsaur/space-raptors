#pragma strict

public var destroyem :boolean;
public var cannonCoolDown :int;
public var projectile :GameObject;


private var cannonTimer :int;
private var shooting :boolean;
private var myPlatform :GameObject;
private var player :GameObject;
private var playerPlatform :GameObject;


function Start() {
	player = GameObject.Find('player');
}

function FixedUpdate() {
	if (!destroyem) return;
	myPlatform = Methods.onTaggedObject(this.gameObject, 0.1, 'Platform');
	playerPlatform = Methods.onTaggedObject(player, 0.1, 'Platform');

	if (cannonTimer && !shooting) cannonTimer--;

	if (!cannonTimer && myPlatform) {
		cannonTimer = cannonCoolDown;
		shooting = true;
//		StartCoroutine(AimAndShoot());
	}

}

