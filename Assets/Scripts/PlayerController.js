#pragma strict

var health :int;
var speed :float;
var jumpForce :float;
var rigidBody :Rigidbody2D;
var maxVelocity :float;
var turnDeadZone :float;
var animator :Animator;
var shotOffset :Vector2;
var currentWeapon :GameObject;
var defaultCooldown :float;
var weapons : GameObject[];
var switchCooldown :float;
var armor :int;
var collisionDamage :int;
var stealthTime :float;
var stealth :boolean;
var stealthCooldown :float;
var bootDust :GameObject;
var ammo :int[];
var pauseMenu :GameObject;
var paused :boolean;

private var score : int;
private var HUDManager :HUDManager;
private var SoundFXManager :SoundFXManager;
private var audioSource :AudioSource;
private var weaponAnimator :Animator;
private var weaponProjectile :GameObject;
private var shotCooldown :float;
private var previousPosition :Vector2;
private var weaponIcon :Sprite;
private var ammoType :int;

function Start () {
	shotCooldown = 0;
	HUDManager = GameObject.Find("HUDCanvas").GetComponent("HUDManager");
	SoundFXManager = GameObject.Find("SoundFX").GetComponent("SoundFXManager");
	audioSource = gameObject.GetComponent(AudioSource);
	previousPosition = new Vector2(0,0);

	GameObject.Find('CheckpointController').GetComponent(CheckpointController).Load();
}

function OnSpawn() {
	weaponAnimator = currentWeapon.GetComponent(Animator);
	weaponProjectile = currentWeapon.GetComponent(WeaponDetails).projectile;
	weaponIcon = currentWeapon.GetComponent(WeaponDetails).weaponIcon;
	ammoType = currentWeapon.GetComponent(WeaponDetails).ammoType -1;
}

function Awake () {
	DontDestroyOnLoad(transform.gameObject);
}

function setAnimation (name :String, state :boolean) {
	animator.SetBool(name, state);
	weaponAnimator.SetBool(name, state);
}

function FixedUpdate () {
	if (stealthTime && stealth) {
		stealthTime -= Time.deltaTime;
		HUDManager.UpdateStealth(stealthTime);
		if (stealthTime <= 0) {
			stealth = false;
			GetComponent(SpriteRenderer).color.a = 1;
		}
	}

	if (shotCooldown) {
		shotCooldown -= Time.deltaTime;
	}
	if (stealthCooldown) {
		stealthCooldown -= Time.deltaTime;
	}
	if (switchCooldown) {
		switchCooldown -= Time.deltaTime;
	}

	if (Input.GetAxis("Cancel")) {
		if (!paused) {
			paused = true;
			Instantiate(pauseMenu);
		}
	}

	var direction = Input.GetAxisRaw("Horizontal") * speed * Time.deltaTime;
	if (animator.GetBool("dead") == false) {
		var moved :boolean = !Mathf.Approximately(transform.position.x, previousPosition.x) ||
			!Mathf.Approximately(transform.position.y, previousPosition.y);
		var tried :boolean = !Mathf.Approximately(direction, 0) && !Mathf.Approximately(transform.position.x, previousPosition.x);
		transform.Translate(new Vector2(direction, tried ? 0.1 : 0));
		previousPosition = transform.position;
	}
	if (direction > turnDeadZone) {
		transform.localScale = new Vector3(1, 1, 1);
		setAnimation("walking", true);
		shotOffset.x = 2;
	} else if (direction < -turnDeadZone) {
		transform.localScale = new Vector3(-1, 1, 1);
		setAnimation("walking", true);
		shotOffset.x = -2;
	} else {
		setAnimation("walking", false);
	}



	if (Input.GetAxis("Jump") > 0
		  && (!animator.GetBool("jumping") && !animator.GetBool("falling"))
		  && rigidBody.velocity.y == 0
		  && animator.GetBool("dead") == false)
	{
		rigidBody.AddForce(Vector2(0, jumpForce));
		setAnimation("walking", false);
		setAnimation("jumping", true);
		SoundFXManager.Play(audioSource, "action", "player_jump");
		var dust = Instantiate(bootDust, transform.position, Quaternion.identity);
		Destroy(dust, dust.GetComponent(ParticleSystem).duration);
	} else if (rigidBody.velocity.y < 0) {
		setAnimation("jumping", false);
		setAnimation("falling", true);
	} else if (rigidBody.velocity.y == 0 && !animator.GetBool("jumping")) {
		setAnimation("jumping", false);
		setAnimation("falling", false);
	}

	var shoot = Input.GetAxis("Fire1");
	if (ammo[ammoType] > 0 && shotCooldown <= 0 && shoot && animator.GetBool("dead") == false) {
		animator.SetTrigger("shoot");
		weaponAnimator.SetTrigger("shoot");
		var newShot = Instantiate(weaponProjectile, Vector2(gameObject.transform.position.x + shotOffset.x, gameObject.transform.position.y + shotOffset.y), Quaternion.identity);
		newShot.GetComponent(ProjectileController).direction.x = transform.localScale.x;
		shotCooldown = defaultCooldown;
		ammo[ammoType]--;
		HUDManager.UpdateAmmo(ammo[ammoType]);
	}

	var weaponSwitch = 0;

	if (Input.GetAxis("Stealth") && stealthCooldown <= 0) {
		stealthCooldown = defaultCooldown;
		if (stealth) {
			stealth = false;
			GetComponent(SpriteRenderer).color.a = 1;
		} else if (!stealth && stealthTime) {
			stealth = true;
			GetComponent(SpriteRenderer).color.a = 0.2;
		}
	}

	if (Input.GetAxis("Fire2")) {
		weaponSwitch = -1;
	} else if (Input.GetAxis("Fire3")) {
		weaponSwitch = 1;
	}
	if (switchCooldown <= 0 && weaponSwitch && animator.GetBool("dead") == false) {
		switchCooldown = defaultCooldown;
		var current :int;
		for (var i=0;i<weapons.length;i++) {
			if (weapons[i].name == currentWeapon.name.Replace("(Clone)", "")) {
				current = i;
				break;
			}
		}
		if(current + weaponSwitch >= 0 && current + weaponSwitch < weapons.length && animator.GetBool("dead") == false) {
			SwitchWeapon(weapons[current + weaponSwitch]);
		}
	}
}

function ItemPickup (newItem :GameObject) {
	if (newItem.tag == "Weapon") {
		System.Array.Resize.<GameObject>(weapons, weapons.length + 1);
		weapons[weapons.length - 1] = newItem;
		ammo[newItem.GetComponent(WeaponDetails).ammoType]+=20;
		SwitchWeapon(newItem);
	} else if (newItem.tag == "Powerup") {
		if (newItem.name.Contains("Health" && "25")) {
			HealDamage(25);
			SoundFXManager.Play(audioSource, "item_pickup", "health_25");
		} else if (newItem.name.Contains("Health" && "50")) {
			HealDamage(50);
			SoundFXManager.Play(audioSource, "item_pickup", "health_50");
		} else if (newItem.name.Contains("Health" && "Max")) {
			HealDamage(100);
			SoundFXManager.Play(audioSource, "item_pickup", "health_max");
		} else if (newItem.name.Contains("Armor" && "50")) {
			IncreaseArmor(50);
			SoundFXManager.Play(audioSource, "item_pickup", "powerup");
		} else if (newItem.name.Contains("Armor" && "100")) {
			IncreaseArmor(100);
			SoundFXManager.Play(audioSource, "item_pickup", "powerup");
		} else if (newItem.name.Contains("Ammo" && "1")) {
			IncreaseAmmo(15, 0);
			SoundFXManager.Play(audioSource, "item_pickup", "powerup");
		} else if (newItem.name.Contains("Ammo" && "2")) {
			IncreaseAmmo(10, 1);
			SoundFXManager.Play(audioSource, "item_pickup", "powerup");
		}
	}
}

function OnCollisionEnter2D (collision :Collision2D) {
//	if (collision.gameObject.tag == "Enemy") {
//		TakeDamage(collisionDamage);
//		SoundFXManager.Play(audioSource, "explosion", "small");
//	} else
	if (collision.gameObject.tag == "Spikes") {
		if (armor > 0) {
			TakeDamage(collisionDamage * 2);
			SoundFXManager.Play(audioSource, "explosion", "small");
		} else {
			TakeDamage(collisionDamage * 4);
			SoundFXManager.Play(audioSource, "explosion", "medium");
		}
	}
}

//TODO: Refactor IncreaseArmor and HealDamage into a PowerUp function
function IncreaseArmor (heal :int) {
	armor += heal;
	if (armor > 100) {
		armor = 100;
	}
	HUDManager.UpdateArmor(armor);
}

function HealDamage (heal :int) {
	health += heal;
	if (health > 100) {
		health = 100;
	}
	HUDManager.UpdateHealth(health);
}

function IncreaseAmmo (value :int, ammoId :int) {
	ammo[ammoId] += value;
	if (ammoId == currentWeapon.GetComponent(WeaponDetails).ammoType) {
		HUDManager.UpdateAmmo(ammo[ammoId]);
	}
}

function TakeDamage (damage :int) {
	animator.SetTrigger("hit");
	weaponAnimator.SetTrigger("hit");
	if (armor) {
		armor -= damage;
		if (armor < 0) {
			armor = 0;
		}
	} else {
		health -= damage;
		if (health <= 0) {
			setAnimation("dead", true);
		}
	}
	if (health > 0) {
		this.gameObject.SendMessage("DisplayDamage");
		HUDManager.UpdateArmor(armor);
		HUDManager.UpdateHealth(health);
	} else {
		HUDManager.UpdateArmor(0);
		HUDManager.UpdateHealth(0);
	}
	transform.position.x += (-transform.localScale.x / 4);
}

function SwitchWeapon (weapon :GameObject) {
	Methods.destroyChildren(this.gameObject);
	var newWeapon = Instantiate(weapon, gameObject.transform.position, Quaternion.identity);
	newWeapon.transform.parent = gameObject.transform;
	newWeapon.transform.localScale.x *= transform.localScale.x;
	currentWeapon = newWeapon;
	weaponAnimator = currentWeapon.GetComponent(Animator);
	weaponProjectile = currentWeapon.GetComponent(WeaponDetails).projectile;
	weaponIcon = currentWeapon.GetComponent(WeaponDetails).weaponIcon;
	ammoType = currentWeapon.GetComponent(WeaponDetails).ammoType -1;
	HUDManager.UpdateWeapon(weaponIcon);
	HUDManager.UpdateAmmo(ammo[ammoType]);
}

function GetPoints (points: int) {
	score += points;
	HUDManager.UpdatePoints(score);

}

function Die () {
	Application.LoadLevel (Application.loadedLevel);
}

function GetScore() :int {
	return score;
}

function ResetScore(newScore :int) {
	score = newScore;
}

function InitHUD() {
	HUDManager.UpdateArmor(armor);
	HUDManager.UpdateStealth(stealthTime);
	HUDManager.UpdatePoints(score);
	HUDManager.UpdateAmmo(ammo[ammoType]);
}
