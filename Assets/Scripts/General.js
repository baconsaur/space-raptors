#pragma strict

public class General extends ScriptableObject {
	static function onTaggedObject(object :GameObject, tolerance :float, tag :String) :GameObject {
		var collider :BoxCollider2D = object.GetComponent(BoxCollider2D);
		var platforms :GameObject[] = GameObject.FindGameObjectsWithTag(tag);
		for (var i :int = 0; i < platforms.Length; i++) {
			var thickness :float = platforms[i].transform.localScale.y / 2f;
			var vec :Vector3 = object.transform.position - collider.bounds.extents - new Vector3(0, thickness, 0);
			if (Mathf.Abs(vec.y - platforms[i].transform.position.y) <= tolerance) return platforms[i];
			if (platforms[i] == GameObject.Find('floor')) {
				Debug.Log(Mathf.Abs(vec.y - platforms[i].transform.position.y));
			}
		}
		return null;
	}
	static function distance(point1 :Vector2, point2 :Vector2): float {
		return Mathf.Sqrt(Mathf.Pow(point1.x - point2.x, 2.0) + Mathf.Pow(point1.y - point2.y, 2.0));
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
	static function each(array :Array, func :Function) {
		for (var i :int; i < array.length; i++) {
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
	static function sort(array :Array, func :Function) {
		for (var i :int = 1; i < array.length; ) {
			var order :int = func(array[i - 1], array[i]);
			if (order < 0) {
				swap(array, i, i - 1);
				if (i > 1) i--;
			}
			else i++;
		}
	}
}