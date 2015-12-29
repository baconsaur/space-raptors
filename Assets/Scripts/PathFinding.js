#pragma strict

public class PathFinding extends MonoBehaviour {
	private class BuildCollection {
		private var Methods :Methods;
		public var start :Methods.ObjectWithCorners;
		public var target :Methods.ObjectWithCorners;
		public var platforms :Methods.ObjectWithCorners[];
		public var steps :Array;
		public var possibilities :Array;
		public var position :Vector2;
		public function BuildCollection(startP :GameObject, targetP :GameObject, tag :String) {
			var plats = GameObject.FindGameObjectsWithTag(tag);
			platforms = new Methods.ObjectWithCorners[plats.Length];
			for (var i :int = 0; i < plats.Length; i++) {
				platforms[i] = new Methods.ObjectWithCorners(plats[i]);
			}
			start = new Methods.ObjectWithCorners(startP);
			target = new Methods.ObjectWithCorners(targetP);
			steps = new Array(start);
			possibilities = new Array();
		}
		public function stepThrough(current :Methods.ObjectWithCorners, tolerance :float, stats :Capabilities) {
			var position :int = 0;
			// Build a viable path to target from start
			while (position >= 0 && current.gameObject != target.gameObject)
			{
				if (possibilities.length <= position) {
					// a list of every platform that can be reached from current platfrom that is not already in the path
					var options :Array = Methods.filter(platforms, function(object :Methods.ObjectWithCorners) :boolean {
						return object.gameObject != current.gameObject && reachable(current, object, stats) &&
						PathFinding.notIn(steps, object);
					});
					// sort by distance to target platform with preference to higher platforms
					Methods.sort(options, function(obj1 :Methods.ObjectWithCorners, obj2 :Methods.ObjectWithCorners) :float {
						return (Methods.distance(target.corners.landCenter, obj1.corners.landCenter) - obj1.corners.landCenter.y) -
							(Methods.distance(target.corners.landCenter, obj2.corners.landCenter) - obj2.corners.landCenter.y);
					});
					possibilities.Push(options);
				}
				if ((possibilities[position] as Array).length == 0) {
					possibilities.Pop();
					steps.Pop();
					position--;
				} else {
					if (Methods.indexOf(possibilities[position] as Array, target) >= 0) {
						current = target;
					} else {
						current = (possibilities[position] as Array).Pop() as Methods.ObjectWithCorners;
					}
					steps.Push(current);
					position++;
				}
			}
		}
	}
	public static function buildSteps(target :GameObject, mover :GameObject, tag :String, tolerance :float, stats :Capabilities) :Array {
		var Methods :Methods;
		var startPlatform :GameObject = Methods.onTaggedObject(mover, 0.1, tag);
		var targetPlatform :GameObject = Methods.onTaggedObject(target, 0.1, tag);
		if (!startPlatform || !targetPlatform || startPlatform == targetPlatform) return new Array();
		var collection :BuildCollection = new BuildCollection(startPlatform, targetPlatform, tag);
		collection.stepThrough(collection.start, tolerance, stats);
		return Methods.map(collection.steps, function(element :Methods.ObjectWithCorners) :GameObject {
			return element.gameObject;
		});
	}
	private static function reachable(start :Methods.ObjectWithCorners, end :Methods.ObjectWithCorners, stats :Capabilities) :boolean {
		return end.corners.topLeft.y <= start.corners.topLeft.y + stats.jumpHeight &&
			end.corners.topLeft.x <= start.corners.topRight.x + stats.jumpWidth &&
			end.corners.topRight.x >= start.corners.topLeft.x - stats.jumpWidth;
	}
	private static function notIn(array :Array, object :Methods.ObjectWithCorners) :boolean {
		for (var i :int = 0; i < array.length; i++) {
			if ((array[i] as Methods.ObjectWithCorners).gameObject == object.gameObject) return false;
		}
		return true;
	}
	public static function howToGetThere(object :GameObject, start :GameObject, target :GameObject, tolerance :float, stats :Capabilities) :Array {
		var objectExtend :Methods.ObjectWithCorners = new Methods.ObjectWithCorners(object);
		var startExtend :Methods.ObjectWithCorners = new Methods.ObjectWithCorners(start);
		var targetExtend :Methods.ObjectWithCorners = new Methods.ObjectWithCorners(target);
		if (!PathFinding.reachable(startExtend, targetExtend, stats)) return new Array();

		var myWidth = Methods.distance(objectExtend.corners.bottomLeft, objectExtend.corners.bottomRight);
		var position :Vector2;
		var yOffset :float;
		
		////
		// On the Level
		////
		if (Mathf.Abs(startExtend.corners.landCenter.y - targetExtend.corners.landCenter.y) <= tolerance) {
			if (startExtend.corners.landCenter.x > targetExtend.corners.landCenter.x) {
				// => to the left
				if (startExtend.corners.topLeft.x < targetExtend.corners.topRight.x + myWidth) {
					return new Array('MoveLeft', targetExtend.corners.topRight);
				} else {
					return new Array('JumpLeft', startExtend.corners.topLeft, startExtend.corners.landCenter.y, targetExtend.corners.topRight);
				}
			} else {
				// => to the right
				if (startExtend.corners.topRight.x > targetExtend.corners.topLeft.x - myWidth) {
					return new Array('MoveRight', targetExtend.corners.topLeft);
				} else {
					return new Array('JumpRight', startExtend.corners.topRight, startExtend.corners.landCenter.y, targetExtend.corners.topLeft);
				}
			}
			
		////
		// Aim toward the sky and rise
		////
		} else if (startExtend.corners.landCenter.y < targetExtend.corners.landCenter.y) {
			if (startExtend.corners.topLeft.x >= targetExtend.corners.topRight.x + (myWidth / 2f)) {
				// jump across left
				return new Array('JumpLeft', startExtend.corners.topLeft, targetExtend.corners.landCenter.y, targetExtend.corners.topRight);
			} else if (startExtend.corners.topRight.x <= targetExtend.corners.topLeft.x - (myWidth  / 2f)) {
				// jump acrros right
				return new Array('JumpRight', startExtend.corners.topRight, targetExtend.corners.landCenter.y, targetExtend.corners.topLeft);
			} else if (startExtend.corners.topRight.x > targetExtend.corners.topRight.x + myWidth) {
				// jump up left
				position = new Vector2(targetExtend.corners.topRight.x + myWidth, startExtend.corners.landCenter.y);
				return new Array('JumpLeft', position, targetExtend.corners.landCenter.y, targetExtend.corners.topRight);
			} else if (startExtend.corners.topLeft.x < targetExtend.corners.topLeft.x + myWidth) {
				// jump up right
				position = new Vector2(targetExtend.corners.topLeft.x - myWidth, startExtend.corners.landCenter.y);
				return new Array('JumpRight', position, targetExtend.corners.landCenter.y, targetExtend.corners.topLeft);
			} else if (startExtend.corners.topLeft.x <= targetExtend.corners.topLeft.x) {
				// jump around left
				return new Array('JumpAroundLeft', startExtend.corners.topLeft, targetExtend.corners.topLeft);
			} else if (startExtend.corners.topRight.x >= targetExtend.corners.topRight.x) {
				// jump around right
				return new Array('JumpAroundRight', startExtend.corners.topRight, targetExtend.corners.topRight);
			} else return new Array('PATHFINDING ERROR: jump, but no go');
			
		////
		// I was up above it
		////
		} else {
			if (startExtend.corners.topLeft.x > targetExtend.corners.topLeft.x + myWidth) {
				// Fall or Jump Left?
				yOffset = Mathf.Sqrt(targetExtend.corners.landCenter.y - startExtend.corners.landCenter.y);
				if (startExtend.corners.topLeft.x < targetExtend.corners.topRight.x + myWidth + yOffset) {
					// fall left
					return new Array('FallLeft', targetExtend.corners.topRight);
				} else {
					// jump left
					return new Array('JumpLeft', startExtend.corners.topLeft, startExtend.corners.landCenter.y, targetExtend.corners.topLeft);
				}
			} else if (startExtend.corners.topRight.x < targetExtend.corners.topRight.x - myWidth) {
				// Fall or Jump Right?
				yOffset = Mathf.Sqrt(targetExtend.corners.landCenter.y - startExtend.corners.landCenter.y);
				if (startExtend.corners.topRight.x > targetExtend.corners.topLeft.x - myWidth - yOffset) {
					// fall right
					return new Array('FallRight', targetExtend.corners.topLeft);
				} else {
					return new Array('JumpRight', startExtend.corners.topRight, startExtend.corners.landCenter.y, targetExtend.corners.topRight);
				}
			} else if (Methods.distance(startExtend.corners.topLeft, targetExtend.corners.topLeft) <=
				Methods.distance(startExtend.corners.topRight, targetExtend.corners.topLeft)
			) {
				return new Array('FallAroundLeft', targetExtend.corners.topLeft);
			} else {
				return new Array('FallAroundRight', targetExtend.corners.topRight);
			}
		}
	}
}
