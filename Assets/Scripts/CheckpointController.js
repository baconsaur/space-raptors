#pragma strict

public class CheckpointController extends MonoBehaviour {
	public static var checkpoint :CheckpointController;

	public var playerHealth :int;


	private var player :GameObject;
	private var playerController :PlayerController;



	function Awake() {
		if (!checkpoint) {
			DontDestroyOnLoad(this.gameObject);
			checkpoint = this;
		} else if (checkpoint != this) {
			Destroy(this.gameObject);
		}
		player = GameObject.Find('Player');
		playerController = player.GetComponent(PlayerController);
	}

	public function Save() {
		playerHealth = playerController.health;
	}
}