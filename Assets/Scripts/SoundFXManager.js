var item_pickup_ammo :AudioClip;
var item_pickup_health_max :AudioClip;
var item_pickup_health_25 :AudioClip;
var item_pickup_health_50 :AudioClip;
var item_pickup_powerup :AudioClip;
var item_pickup_weapons :AudioClip;

var explosion_large :AudioClip;
var explosion_medium :AudioClip;
var explosion_small :AudioClip;

var action_player_jump :AudioClip;
var action_raptor_jump :AudioClip;

private var sounds;

function Start() {
  sounds = {
    "explosion": {
      "large": explosion_large,
      "medium": explosion_medium,
      "small": explosion_small
    },
    "item_pickup": {
      "health_max": item_pickup_health_max,
      "health_50": item_pickup_health_50,
      "health_25": item_pickup_health_25,
      "ammo": item_pickup_ammo,
      "powerup": item_pickup_powerup,
      "weapons": item_pickup_powerup
    },
    "action": {
      "player_jump": action_player_jump,
      "raptor_jump": action_raptor_jump
    }
  };
}

function Play(audioSource :AudioSource, type :String, description :String) {
  if(sounds[type]) {
    if(sounds[type][description]) {
      if (type == 'explosion') {
      	var cam :CameraController = GameObject.Find('Main Camera').GetComponent(CameraController);
      	switch(description) {
      		case 'large':
      			cam.Shake(6, 0.7);
      			break;
      		case 'medium':
      			cam.Shake(4, 0.4);
      			break;
      		case 'small':
      			cam.Shake(2, 0.1);
      			break;
      		default: break;
      	}
      }
      audioSource.PlayOneShot(sounds[type][description]);
    }
  }
}
