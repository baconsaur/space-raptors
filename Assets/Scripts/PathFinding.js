#pragma strict

public class PathFinding extends ScriptableObject {
	private var methods :General;
	public function Pathfinding() {
		methods = ScriptableObject.CreateInstance('General') as General;
	}
	private class BuildCollection {
		private var methods :General;
		public var start :General.ObjectWithCorners;
		public var target :General.ObjectWithCorners;
		public var platforms :General.ObjectWithCorners[];
		public var steps :Array;
		public var possibilities :Array;
		public var position :Vector2;
		public function BuildCollection(startP :GameObject, targetP :GameObject, tag :String, meth :General) {
			methods = meth;
			var plats = GameObject.FindGameObjectsWithTag(tag);
			platforms = new General.ObjectWithCorners[plats.Length];
			for (var i :int = 0; i < plats.Length; i++) {
				platforms[i] = new General.ObjectWithCorners(plats[i]);
			}
			start = new General.ObjectWithCorners(startP);
			target = new General.ObjectWithCorners(targetP);
			steps = new Array(start);
			possibilities = new Array();
		}
		public function stepThrough(current :General.ObjectWithCorners, tolerance :float, stats :Capabilities) {
			var position :int = 0;
			// Build a viable path to target from start
			while (position >= 0 && current.gameObject != target.gameObject)
			{
				if (possibilities.length <= position) {
					// a list of every platform that can be reached from current platfrom that is not already in the path
					var options :Array = methods.filter(platforms, function(object :General.ObjectWithCorners) :boolean {
						return object.gameObject != current.gameObject && reachable(current, object, stats) &&
						PathFinding.notIn(steps, object);
					});
					// sort by distance to target platform with preference to higher platforms
					methods.sort(options, function(obj1 :General.ObjectWithCorners, obj2 :General.ObjectWithCorners) :float {
						return (methods.distance(target.corners.landCenter, obj1.corners.landCenter) - obj1.corners.landCenter.y) -
							(methods.distance(target.corners.landCenter, obj2.corners.landCenter) - obj2.corners.landCenter.y);
					});
					possibilities.Push(options);
				}
				if ((possibilities[position] as Array).length == 0) {
					possibilities.Pop();
					steps.Pop();
					position--;
				} else {
					if (methods.indexOf(possibilities[position] as Array, target) >= 0) {
						current = target;
					} else {
						current = (possibilities[position] as Array).Pop() as General.ObjectWithCorners;
					}
					steps.Push(current);
					position++;
				}
			}
		}
	}
	public function buildSteps(target :GameObject, mover :GameObject, tag :String, tolerance :float, stats :Capabilities) :Array {
		var startPlatform :GameObject = methods.onTaggedObject(mover, 0.1, tag);
		var targetPlatform :GameObject = methods.onTaggedObject(target, 0.1, tag);
		if (!startPlatform || !targetPlatform) return new Array();
		
		var collection :BuildCollection = new BuildCollection(startPlatform, targetPlatform, tag, methods);
		collection.stepThrough(collection.start, tolerance, stats);
		return methods.map(collection.steps, function(element :General.ObjectWithCorners) :GameObject {
			return element.gameObject;
		});
	}
	private static function reachable(start :General.ObjectWithCorners, end :General.ObjectWithCorners, stats :Capabilities) :boolean {
		return end.corners.topLeft.y <= start.corners.topLeft.y + stats.jumpHeight &&
			end.corners.topLeft.x <= start.corners.topRight.x + stats.jumpWidth &&
			end.corners.topRight.x >= start.corners.topLeft.x - stats.jumpWidth;
	}
	private static function notIn(array :Array, object :General.ObjectWithCorners) :boolean {
		for (var i :int = 0; i < array.length; i++) {
			if ((array[i] as General.ObjectWithCorners).gameObject == object.gameObject) return false;
		}
		return true;
	}
}
