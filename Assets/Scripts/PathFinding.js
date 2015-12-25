#pragma strict

public class PathFinding extends ScriptableObject {
	private var methods :General = ScriptableObject.CreateInstance('General') as General;
	public var actions :Array;
	private class Instruction {
		public var go :Function;
		public function Instruction(meth :Function, arg :float, expectedPlatform :GameObject) {
			go = function() {
				meth(arg, expectedPlatform);
			};
		}
	}
	private class Step {
		public var instruction :Instruction;
		public var leftToTry :Array = new Array();
		public var start :ObjectWithCorners;
		public var end :ObjectWithCorners;
		public function Step(startPlatform :ObjectWithCorners, endPlatform :ObjectWithCorners) {
			start = startPlatform;
			end = endPlatform;
		}
	}
	private class Steps {
		public var steps :Array;
		public var platforms :ObjectWithCorners[];
		public function Steps(plats :ObjectWithCorners[]) {
			platforms = plats;
			steps = new Array();
		}
		
	}
	public class Corners {
		public var topLeft :Vector2;
		public var topRight :Vector2;
		public var bottomLeft :Vector2;
		public var bottomRight :Vector2;
		public function Corners(object :GameObject) {
			var pos :Vector2 = new Vector2 (object.transform.position.x, object.transform.position.y);
			var collider :BoxCollider2D = object.GetComponent(BoxCollider2D);
			var ext :Vector2 = new Vector2(collider.bounds.extents.x, collider.bounds.extents.y);
			var off :Vector2 = collider.offset;
			topLeft = new Vector2(pos.x - ext.x + off.x, pos.y + ext.y + off.y);
			topRight = new Vector2(pos.x + ext.x + off.x, pos.y + ext.y + off.y);
			bottomLeft = new Vector2(pos.x - ext.x + off.x, pos.y - ext.y + off.y);
			bottomRight = new Vector2(pos.x + ext.x + off.x, pos.y - ext.y + off.y);
		}
	}
	public class ObjectWithCorners {
		public var corners :Corners;
		public var gameObject :GameObject;
		public function ObjectWithCorners(obj :GameObject) {
			gameObject = obj;
			corners = new Corners(obj);
		}
	}
	private function getPath(start :ObjectWithCorners, end :ObjectWithCorners, tolerance :float) :Instruction {
//		if (true) {
//			return new Instruction(Action.MoveLeft, 0f);
//		} else if (true) {
//			return new Instruction(Action.MoveRight, 0f);
//		} else if (true) {
//			return new Instruction(Action.JumpLeft, 0f);
//		} else if (true) {
//			return new Instruction(Action.JumpRight, 0f);
//		} else if (true) {
//			return new Instruction(Action.JumpAroundLeft, 0f);
//		} else if (true) {
//			return new Instruction(Action.JumpAroundRight, 0f);
//		} else if (true) {
//			return new Instruction(Action.FallAroundLeft, 0f);
//		} else if (true) {
//			return new Instruction(Action.FallAroundRight, 0f);
//		} else {
//			return null;
//		}
	}
	public function buildSteps(player :GameObject, enemy :GameObject, tag :String, tolerance :float) {
		actions = null;
		var plats :GameObject[] = GameObject.FindGameObjectsWithTag(tag);
		var platforms :ObjectWithCorners[] = new ObjectWithCorners[plats.Length];
		for (var i :int = 0; i < plats.Length; i++) {
			platforms[i] = new ObjectWithCorners(plats[i]);
		}
		var platP :GameObject = methods.onTaggedObject(player, 0.01, 'Platform');
		var platE :GameObject = methods.onTaggedObject(enemy, 0.01, 'Platform');
		if (!platP || !platE) return;
		var playerPlatform :ObjectWithCorners = new ObjectWithCorners(platP);
		var enemyPlatform :ObjectWithCorners = new ObjectWithCorners(platE);
		
		
	}
//	public function makeInstruction(meth :Function, arg :float, plats :GameObject[]) :Instruction {
//		return new Instruction(meth, arg, plats);
//	}
//	public function seeCaps(test :Capabilities) {
//		Debug.Log(test.speed);
//	}
	
}
