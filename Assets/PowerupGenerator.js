#pragma strict
public var dropRate :float;
public var ammo :GameObject[];
public var armor :GameObject[];
public var health :GameObject[];
public var maxDistanceToPlayer :float;

private var dropped :GameObject;
private var dropCooldown :float;
private var lastDropList :GameObject[];
private var player :GameObject;


function Start () {
	dropCooldown = dropRate;
	player = GameObject.Find('Player');
}

function Update () {
	if (dropCooldown >= 0 && !dropped) dropCooldown -= Time.deltaTime;
	else if (!dropped && Methods.distance(transform.position, player.transform.position) > maxDistanceToPlayer) DropItem();
}

function DropItem() {
	dropCooldown = dropRate;
	switch (lastDropList) {
		case ammo:
			lastDropList = Random.value >= 0.5 ? armor : health;
			break;
		default:
			lastDropList = ammo;
	}

	dropped = Instantiate(lastDropList[RandomIndex(lastDropList.Length)], transform.position, Quaternion.identity);
}

function RandomIndex(length :int) :int {
	return Mathf.Round(Random.Range(0, length - 1));
}