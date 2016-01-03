#pragma strict

public class Methods extends MonoBehaviour {
	public class Corners {
		public var topLeft :Vector2;
		public var topRight :Vector2;
		public var bottomLeft :Vector2;
		public var bottomRight :Vector2;
		public var landCenter :Vector2;
		public function Corners(object :GameObject) {
			var pos :Vector2 = new Vector2 (object.transform.position.x, object.transform.position.y);
			var collider :BoxCollider2D = object.GetComponent(BoxCollider2D);
			var ext :Vector2 = new Vector2(collider.bounds.extents.x, collider.bounds.extents.y);
			var off :Vector2 = collider.offset;
			topLeft = new Vector2(pos.x - ext.x + off.x, pos.y + ext.y + off.y);
			topRight = new Vector2(pos.x + ext.x + off.x, pos.y + ext.y + off.y);
			bottomLeft = new Vector2(pos.x - ext.x + off.x, pos.y - ext.y + off.y);
			bottomRight = new Vector2(pos.x + ext.x + off.x, pos.y - ext.y + off.y);
			landCenter = new Vector2(Methods.average(topLeft.x, topRight.x), topLeft.y);
		}
	}
	public class ObjectWithCorners {
		public var gameObject :GameObject;
		public var corners :Corners;
		public function ObjectWithCorners(obj :GameObject) {
			gameObject = obj;
			corners = new Corners(obj);
		}
	}
	
	
	
	public static function onTaggedObject(object :GameObject, tolerance :float, tag :String) :GameObject {
		var objectCorners :Corners = new Corners(object);
		var platforms :GameObject[] = GameObject.FindGameObjectsWithTag(tag);
		for (var i :int; i < platforms.length; i++) {
			var corners :Corners = new Corners(platforms[i]);
			if (objectCorners.bottomRight.x > corners.topLeft.x && objectCorners.bottomLeft.x < corners.topRight.x &&
			Mathf.Abs(objectCorners.bottomLeft.y - corners.topLeft.y) <= tolerance) return platforms[i];
		}
		return null;
	}
	public static function onSomething(object :GameObject, tolerance :float) :GameObject {
		var ray :RaycastHit2D = RaycastClosest(object.transform.position, Vector2(0, -1), object.transform);
		var corner :ObjectWithCorners = new ObjectWithCorners(object);
		if (ray.distance <= (object.transform.position.y - corner.corners.bottomLeft.y) + tolerance) return ray.transform.gameObject;
		else return null;
	}
	static function distance(point1 :Vector2, point2 :Vector2): float {
		return Mathf.Sqrt(Mathf.Pow(point1.x - point2.x, 2.0) + Mathf.Pow(point1.y - point2.y, 2.0));
	}
	static function average(val1 :float, val2 :float) :float {
		return (val1 + val2) / 2f;
	}
	static function indexOf(array :Array, element) :int {
		for (var i :int = 0; i < array.length; i++) {
			if (array[i] == element) return i;
		}
		return -1;
	}
	static function filter(array :Array, func :Function) :Array {
		var ret :Array = new Array();
		for (var i :int = 0; i < array.length; i++) {
			if (func(array[i])) ret.Push(array[i]);
		}
		return ret;
	}
	static function forEach(array :Array, func :Function) {
		for (var i :int = 0; i < array.length; i++) {
			func(array[i]);
		}
	}
	static function map(array :Array, func :Function) :Array {
		var ret :Array = new Array();
		for (var i :int = 0; i < array.length; i++) {
			ret.push(func(array[i]));
		}
		return ret;
	}
	static function reduce(array :Array, func :Function, accumulator) {
		for (var i :int = 0; i < array.length; i++) {
			accumulator = func(accumulator, array[i]);
		}
		return accumulator;
	}
	static function insert(array :Array, element, position :int) :Array {
		var ret :Array = new Array();
		for (var i :int = 0; i < array.length; i++) {
			if (i == position) ret.Push(element);
			ret.Push(array[i]);
		}
		if (i <= position) ret.Push(element);
		return ret;
	}
	static function eject(array :Array, position :int) :Array {
		var ret :Array = new Array();
		for (var i :int = 0; i < array.length; i++) {
			if (i != position) ret.Push(array[i]);
		}
		return ret;
	}
	static function swap(array :Array, pos1 :int, pos2 :int) {
		var temp = array[pos1];
		array[pos1] = array[pos2];
		array[pos2] = temp;
	}
	static function sort(array :Array, func :Function) :Array{
		for (var i :int = 1; i < array.length; ) {
			var order :float = func(array[i - 1], array[i]);
			if (order < 0) {
				swap(array, i, i - 1);
				if (i > 1) i--;
			}
			else i++;
		}
		return array;
	}
	static function Raycast(position :Vector2, direction :Vector2, trans :Transform) :RaycastHit2D[] {
		var rays :RaycastHit2D[];
		var array :Array = new Array();
		rays = Physics2D.RaycastAll(position, direction);
		if (!rays.Length) return;
		for (var i: int = 0; i < rays.Length; i++) {
			array.Push(rays[i]);
		}
		array = filter(array, function(ray :RaycastHit2D) {
			return ray.transform != trans && !ray.collider.isTrigger;
		});
		rays = new RaycastHit2D[array.length];
		for (i = 0; i < array.length; i++) {
			rays[i] = array[i];
		}
		return rays;
	}

	static function RaycastClosest(position :Vector2, direction :Vector2, trans :Transform) :RaycastHit2D {
		var rays :RaycastHit2D[] = Raycast(position, direction, trans);
		var array :Array = new Array();
		if (!rays.Length) return;
		for (var i: int = 0; i < rays.Length; i++) {
			array.Push(rays[i]);
		}
		sort(array, function(ray1 :RaycastHit2D, ray2 :RaycastHit2D) {
			return distance(trans.position, ray2.point) - distance(trans.position, ray1.point);
		});
		return array[0];
	}
	static function compareVectors(ve1 :Vector3, ve2 :Vector3, tolerance :float) :boolean {
		return Mathf.Abs(ve1.x - ve2.x) <= tolerance &&
			Mathf.Abs(ve1.y - ve2.y) <= tolerance &&
			Mathf.Abs(ve1.z - ve2.z) <= tolerance;
	}
}