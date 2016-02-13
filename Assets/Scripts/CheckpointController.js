#pragma strict

public class CheckpointController extends MonoBehaviour {
	public var AllWeapons :GameObject[];
	private class GlobalIdentifier {
		public var name :String;
		public var position :Vector3;
		public function GlobalIdentifier(object :GameObject) {
			name = object.name;
			position = object.transform.position;
		}
	}


	private static var checkpoint :CheckpointController;
	private var player :GameObject;
	private var playerController :PlayerController;
	private var checkpointed :boolean;
	private var position :Vector2;


	private var currentWeapon :int;
	private var weapons :int[];
	private var armor :int;
	private var stealthTime :float;
	private var ammo :int[];
	private var score :int;
	private var powerups :GlobalIdentifier[];
	private var enemies :GlobalIdentifier[];
	private var checkpoints :GlobalIdentifier[];


	function Awake() {
		if (!checkpoint) {
			DontDestroyOnLoad(this.gameObject);
			checkpoint = this;
		} else if (checkpoint != this) {
			Destroy(this.gameObject);
		}
	}

	function SetPlayer() {
		player = GameObject.Find('Player');
		playerController = player.GetComponent(PlayerController);
	}

	function ClearPlayer() {
		player = null;
		playerController = null;
	}

	public function Save(respawnPosition :Vector2, lateCheckpoint :GameObject) {
		SetPlayer();
		checkpointed = true;
		position = respawnPosition;
		currentWeapon = FindInList(AllWeapons, playerController.currentWeapon);
		armor = playerController.armor;
		playerController.stealthTime = 20;
		stealthTime = playerController.stealthTime;
		score = playerController.GetScore();

		weapons = new int[playerController.weapons.Length];
		forEach(weapons, function(item, i) {
			weapons[i] = FindInList(AllWeapons, playerController.weapons[i]);
		});

		ammo = new int[playerController.ammo.Length];
		forEach(ammo, function(item, i) {
			ammo[i] = playerController.ammo[i];
		});

		powerups = StoreAlive(GameObject.FindGameObjectsWithTag('Powerup'));
		enemies = StoreAlive(GameObject.FindGameObjectsWithTag('Enemy'));
		checkpoints = StoreAlive(GameObject.FindGameObjectsWithTag('Checkpoint'), lateCheckpoint);

		ClearPlayer();
	}

	public function Load() {
		SetPlayer();
		if (checkpointed) {
			player.transform.position = position;
			playerController.weapons = new GameObject[weapons.Length];
			for (var i :int = 0; i < weapons.Length; i++) {
				playerController.weapons[i] = AllWeapons[weapons[i]];
			}
			playerController.currentWeapon = AllWeapons[currentWeapon];
//			playerController.SwitchWeapon(playerController.currentWeapon);

			DestroyTheVanquished(powerups, 'Powerup');
			DestroyTheVanquished(enemies, 'Enemy');
			DestroyTheVanquished(checkpoints, 'Checkpoint');

			playerController.armor = armor;
			playerController.stealthTime = stealthTime;
			playerController.ResetScore(score);
			playerController.ammo = ammo;

			playerController.InitHUD();
		}

		playerController.OnSpawn();
		playerController.SwitchWeapon(playerController.currentWeapon);
		ClearPlayer();
	}

	private function DestroyTheVanquished(list :GlobalIdentifier[], tag :String) {
		var destroyed :int = 0;
		var inScene :GameObject[] = GameObject.FindGameObjectsWithTag(tag);
		for (var i :int = 0; i < inScene.Length; i++) {
			var inList :boolean = false;
			for (var j :int = 0; j < list.Length; j++) {
				if (list[j] && inScene[i].name == list[j].name && Methods.compareVectors(inScene[i].transform.position, list[j].position, 15f)) {
					inList = true;
					j = list.Length;
				}
			}
			if (!inList) {
				Destroy(inScene[i]);
				destroyed++;
			}
		}
	}

	private function StoreAlive(list :GameObject[], filter :GameObject) :GlobalIdentifier[] {
		var ret :GlobalIdentifier[] = new GlobalIdentifier[list.Length];
		for (var i :int = 0; i < list.Length; i++) {
			if (filter != list[i]) ret[i] = new GlobalIdentifier(list[i]);
		}
		return ret;
	}
	private function StoreAlive(list :GameObject[]) :GlobalIdentifier[] {
		var ret :GlobalIdentifier[] = new GlobalIdentifier[list.Length];
		for (var i :int = 0; i < list.Length; i++) {
			ret[i] = new GlobalIdentifier(list[i]);
		}
		return ret;
	}

	private function FindInList(list :GameObject[], item :GameObject) :int {
		for (var i :int = 0; i < list.Length; i++) {
			if (item.name == list[i].name || item.name == list[i].name + '(Clone)') return  i;
		}
		return -1;
	}

	private function forEach(list :int[], func :Function) {
		for (var i :int = 0; i < list.Length; i++) {
			func(list[i], i);
		}
	}
}
