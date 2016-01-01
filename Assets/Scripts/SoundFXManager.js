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

function Play(audioSource :AudioSource, type :String, description :String) {
  var clip :AudioClip;
  if(type == "explosion") {
    switch (description) {
      case "large":
        clip = explosion_large;
        break;
      case "medium":
        clip = explosion_medium;
        break;
      case "small":
        clip = explosion_small;
    }
  } else if (type == "item_pickup") {
    switch (description) {
      case "health_max":
        clip = item_pickup_health_max;
        break;
      case "health_50":
        clip = item_pickup_health_50;
        break;
      case "health_25":
        clip = item_pickup_health_25;
        break;
      case "ammo":
        clip = item_pickup_ammo;
        break;
      case "powerup":
        clip = item_pickup_powerup;
        break;
      case "weapons":
        clip = item_pickup_powerup;
        break;
    }
  } else if (type == "action") {
    switch (description) {
      case "player_jump":
        clip = action_player_jump;
        break;
      case "raptor_jump":
        clip = action_raptor_jump;
        break;
    }
  }

  if(clip) {
    audioSource.PlayOneShot(clip);
  }
}
