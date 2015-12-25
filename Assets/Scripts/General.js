#pragma strict

public class General extends ScriptableObject {
	static function onTaggedObject(object :GameObject, tolerance :float, tag :String) :GameObject {
		var collider :BoxCollider2D = object.GetComponent(BoxCollider2D);
		var platforms :GameObject[] = GameObject.FindGameObjectsWithTag(tag);
		for (var i :int = 0; i < platforms.Length; i++) {
			var thickness :float = platforms[i].transform.localScale.y / 2f;
			var vec :Vector3 = object.transform.position - collider.bounds.extents - new Vector3(0, thickness, 0);
			if (Mathf.Abs(vec.y - platforms[i].transform.position.y) <= tolerance) return platforms[i];
		}
		return null;
	}
	static function distance(point1 :Vector2, point2 :Vector2): float {
		return Mathf.Sqrt(Mathf.Pow(point1.x - point2.x, 2.0) + Mathf.Pow(point1.y - point2.y, 2.0));
	}

}