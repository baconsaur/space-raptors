#pragma strict

public class PathFinding extends ScriptableObject {
	private var methods :General;
	public function Pathfinding() {
		methods = ScriptableObject.CreateInstance('General') as General;
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
	public function buildSteps(target :GameObject, mover :GameObject, tag :String, tolerance :float) :Array {
		var startPlatform :GameObject = methods.onTaggedObject(mover, 1, tag);
		var targetPlatform :GameObject = methods.onTaggedObject(target, 1, tag);
		if (!startPlatform || !targetPlatform) return new Array();
		var platforms :GameObject[] = GameObject.FindGameObjectsWithTag(tag);
//		var platformCorners :Corners[] = methods.map(platforms as Array, function(object :GameObject) {
//			return new Corners(object);
//		}) as Corners[];
		
//		var startCorners :Corners = new Corners(startPlatform);
//		var targetCorners :Corners = new Corners(targetPlatform);
		
		var steps :Array = new Array();
		var possibilities :Array = new Array(); //of arrays
		
		var current :GameObject = startPlatform;
		steps.Push(current);
		for (var position :int = 0; position >= 0 && current != targetPlatform; )
		{
//			if (steps.length <= position) steps.Push(current);
			if (possibilities.length <= position) {
				var options :Array = methods.filter(platforms, function(object :GameObject) :boolean {
					return object != current && reachable(current, object) &&
					methods.indexOf(steps, object) == -1;
				});
				possibilities.Push(options);
			}
			if ((possibilities[position] as Array).length == 0) {
				possibilities.Pop();
				steps.Pop();
				position--;
			} else {
				if (methods.indexOf(possibilities[position] as Array, targetPlatform) >= 0) {
					current = targetPlatform;
				} else {
					current = (possibilities[position] as Array).Pop() as GameObject;
				}
				steps.Push(current);
				position++;
			}
		}
		return steps;
	}
	private function reachable(start :GameObject, end :GameObject) :boolean {
		var dist :float = methods.distance(start.transform.position, end.transform.position);
		Debug.Log(dist);
		return dist < 10f;
	}
}
