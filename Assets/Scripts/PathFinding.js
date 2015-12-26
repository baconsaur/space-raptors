#pragma strict

public class PathFinding extends ScriptableObject {
	private var methods :General;
	public function Pathfinding() {
		methods = ScriptableObject.CreateInstance('General') as General;
	}
	public function buildSteps(target :GameObject, mover :GameObject, tag :String, tolerance :float, stats :Capabilities) :Array {
		var startPlatform :GameObject = methods.onTaggedObject(mover, 0.1, tag);
		var targetPlatform :GameObject = methods.onTaggedObject(target, 0.1, tag);
		if (!startPlatform || !targetPlatform) return new Array();
		var platforms :GameObject[] = GameObject.FindGameObjectsWithTag(tag);
		
		var steps :Array = new Array();
		var possibilities :Array = new Array();
		
		var current :GameObject = startPlatform;
		steps.Push(current);
		for (var position :int = 0; position >= 0 && current != targetPlatform; )
		{
			if (possibilities.length <= position) {
				var options :Array = methods.filter(platforms, function(object :GameObject) :boolean {
					return object != current && reachable(current, object, stats) &&
					methods.indexOf(steps, object) == -1;
				});
				methods.sort(options, function(obj1 :GameObject, obj2 :GameObject) {
					var obj1Corners :General.Corners = new General.Corners(obj1);
					var obj2Corners :General.Corners = new General.Corners(obj2);
					return obj1Corners.topLeft.y - obj2Corners.topLeft.y;
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
	private function reachable(start :GameObject, end :GameObject, stats :Capabilities) :boolean {
		var startCorners :General.Corners = new General.Corners(start);
		var endCorners :General.Corners = new General.Corners(end);
		
		return endCorners.topLeft.y <= startCorners.topLeft.y + stats.jumpHeight &&
			endCorners.topLeft.x <= startCorners.topRight.x + stats.jumpWidth &&
			endCorners.topRight.x >= startCorners.topLeft.x - stats.jumpWidth;
	}
}
