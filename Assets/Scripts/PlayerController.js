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
var defaultCooldown :int;
var weapons : GameObject[];
var switchCooldown :int;
var armor :int;

private var weaponAnimator :Animator;
private var weaponProjectile :GameObject;
private var shotCooldown :int;

function Start () {
	shotCooldown = 0;
	weaponAnimator = currentWeapon.GetComponent(Animator);
	weaponProjectile = currentWeapon.GetComponent(ShootWeapon).projectile;
}

function FixedUpdate () {
	if (shotCooldown) {
		shotCooldown--;
	}
	if (switchCooldown) {
		switchCooldown--;
	}
	var direction = Input.GetAxisRaw("Horizontal") * speed * Time.deltaTime;
	transform.Translate(new Vector2(direction, 0));
	
	if (direction > turnDeadZone) {
		transform.localScale = new Vector3(1, 1, 1);
		animator.SetBool("walking", true);
		weaponAnimator.SetBool("walking", true);
		shotOffset.x = 2;
	} else if (direction < -turnDeadZone) {
		transform.localScale = new Vector3(-1, 1, 1);
		animator.SetBool("walking", true);
		weaponAnimator.SetBool("walking", true);
		shotOffset.x = -2;
	} else {
		animator.SetBool("walking", false);
		weaponAnimator.SetBool("walking", false);
	}
	
	if (Input.GetAxis("Vertical") > 0 && rigidBody.velocity.y == 0) {
		animator.SetBool("jumping", true);
		animator.SetBool("walking", false);
		weaponAnimator.SetBool("jumping", true);
		weaponAnimator.SetBool("walking", false);
		rigidBody.AddForce(Vector2(0, jumpForce));
	} else if (rigidBody.velocity.y == 0) {
	//TODO: This also gets set to 0 at the apex of a jump
		animator.SetBool("jumping", false);
		weaponAnimator.SetBool("jumping", false);
	}
	
	var shoot = Input.GetAxis("Fire1");
	if (!shotCooldown && shoot) {
	animator.SetTrigger("shoot");
	weaponAnimator.SetTrigger("shoot");
		var newShot = Instantiate(weaponProjectile, Vector2(gameObject.transform.position.x + shotOffset.x, gameObject.transform.position.y + shotOffset.y), Quaternion.identity);
		newShot.GetComponent(ProjectileController).direction = transform.localScale.x;
		shotCooldown = defaultCooldown;
	}
	
	var weaponSwitch = 0;
	
	if (Input.GetAxis("Fire2")) {
		weaponSwitch = -1;
	} else if (Input.GetAxis("Fire3")) {
		weaponSwitch = 1;
	}
	if (!switchCooldown && weaponSwitch) {
		switchCooldown = 25;
		var current :int;
		for (var i=0;i<weapons.length;i++) {
			if (weapons[i].name == currentWeapon.name.Replace("(Clone)", "")) {
				current = i;
				break;
			}
		}
		if(current + weaponSwitch >= 0 && current + weaponSwitch < weapons.length) {
			SwitchWeapon(weapons[current + weaponSwitch]);
		}
	}
}

function ItemPickup (newItem :GameObject) {
	if (newItem.tag == "Weapon") {
		ArrayUtility.Add(weapons, newItem);
		SwitchWeapon(newItem);
	} else if (newItem.tag == "Powerup") {
		if (newItem.name.Contains("Health" && "25")) {
			HealDamage(25);
		} else if (newItem.name.Contains("Health" && "50")) {
			HealDamage(50);
		} else if (newItem.name.Contains("Health" && "Max")) {
			HealDamage(100);
		}
		if (newItem.name.Contains("Armor")) {
			armor = 100;
		}
	}
}

function HealDamage (heal :int) {
	health += heal;
	if (health > 100) {
		health = 100;
	}
	Debug.Log(health);
}

function TakeDamage (damage :int) {
	if (armor) {
		armor -= damage;
		if (armor < 0) {
			armor = 0;
		}
		Debug.Log(armor);
	} else {
		health -= damage;
		Debug.Log(health);
		if (health <= 0) {
			Application.LoadLevel (Application.loadedLevel);
		}
	}
}

function SwitchWeapon (weapon :GameObject) {
	Destroy(transform.GetChild(0).gameObject);
	
	var newWeapon = Instantiate(weapon, gameObject.transform.position, Quaternion.identity);	newWeapon.transform.parent = gameObject.transform;
	
	newWeapon.transform.localScale.x *= transform.localScale.x;
	currentWeapon = newWeapon;
	weaponAnimator = currentWeapon.GetComponent(Animator);
	weaponProjectile = currentWeapon.GetComponent(ShootWeapon).projectile;

}