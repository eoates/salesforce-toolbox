/**
 * Contains utility/helper methods for working with collections
 */
public class CollectionUtils {
	/**
	 * Returns true if the object implements Iterable
	 *
	 * @param obj The object to check
	 *
	 * @return true if the object is iterable; otherwise, false
	 */
	public static Boolean isIterable(Object obj) {
		return (getIterable(obj) != null);
	}

	/**
	 * Returns true if the list is null or empty
	 *
	 * @param values The list to check
	 *
	 * @return true if the list is null or empty; otherwise, false
	 */
	public static Boolean isEmpty(List<Object> values) {
		Boolean empty = true;
		if (values != null) {
			empty = values.isEmpty();
		}
		return empty;
	}

	/**
	 * Returns true if the iterable is null or empty
	 *
	 * @param values The iterable to check
	 *
	 * @return true if the iterable is null or empty; otherwise, false
	 */
	public static Boolean isEmpty(Iterable<Object> values) {
		Boolean empty = true;
		if (values != null) {
			Iterator<Object> it = values.iterator();
			empty = !it.hasNext();
		}
		return empty;
	}

	/**
	 * Returns true if the value is either null, not iterable, or empty
	 *
	 * @param values The object to check
	 *
	 * @return true if the value is either null, not iterable, or empty; otherwise, false
	 */
	public static Boolean isEmpty(Object values) {
		return isEmpty(getIterable(values));
	}

	/**
	 * If the specified object implements Iterable then it is returned as an iterable
	 *
	 * @param obj The object to check
	 *
	 * @return An Iterable object if obj implements Iterable; otherwise, null
	 */
	public static Iterable<Object> getIterable(Object obj) {
		if (obj != null) {
			try {
				return (Iterable<Object>)obj;
			} catch (Exception e) {
			}
		}
		return null;
	}

	/**
	 * Returns the number of items in the list
	 *
	 * @param values A list
	 *
	 * @return The number of items in the list
	 */
	public static Integer getSize(List<Object> values) {
		return (values != null) ? values.size() : 0;
	}

	/**
	 * Returns the number of items in the iterable. Note that this method has to iterate over the
	 * entire collection in order to determine its size
	 *
	 * @param values An iterable
	 *
	 * @return The number of items in the iterable
	 */
	public static Integer getSize(Iterable<Object> values) {
		Integer size = 0;
		if (values != null) {
			Iterator<Object> it = values.iterator();
			while (it.hasNext()) {
				it.next();
				size++;
			}
		}
		return size;
	}

	/**
	 * Returns the number of items in the object if it is an iterable. If the object does not
	 * implement iterable then 0 is returned
	 *
	 * @param values An object that implements Iterable
	 *
	 * @return The number of items in the object
	 */
	public static Integer getSize(Object values) {
		return getSize(getIterable(values));
	}

	/**
	 * Returns the first item in the list. If the list is null or empty then null is returned
	 *
	 * @param values A list
	 *
	 * @return The first item in the list
	 */
	public static Object getFirst(List<Object> values) {
		return getFirst(values, null);
	}

	/**
	 * Returns the first item in the list. If the list is null or empty then the defaultValue
	 * argument is returned
	 *
	 * @param values A list
	 * @param defaultValue A value to return if the list is null or empty
	 *
	 * @return The first item in the list or defaultValue if list is null or empty
	 */
	public static Object getFirst(List<Object> values, Object defaultValue) {
		return ((values != null) && !values.isEmpty()) ? values[0] : defaultValue;
	}

	/**
	 * Returns the first item in the iterable. If the iterable is null or empty then null is
	 * returned
	 *
	 * @param values An iterable
	 *
	 * @return The first item in the list
	 */
	public static Object getFirst(Iterable<Object> values) {
		return getFirst(values, null);
	}

	/**
	 * Returns the first item in the iterable. If the iterable is null or empty then the
	 * defaultValue argument is returned
	 *
	 * @param values An iterable
	 * @param defaultValue A value to return if the iterable is null or empty
	 *
	 * @return The first item in the iterable or defaultValue if iterable is null or empty
	 */
	public static Object getFirst(Iterable<Object> values, Object defaultValue) {
		if (values != null) {
			Iterator<Object> it = values.iterator();
			if (it.hasNext()) {
				return it.next();
			}
		}
		return defaultValue;
	}

	/**
	 * Returns the first item in an object which implements Iterable. If the object is null, does
	 * not implement Iterable, or is empty then null is returned
	 *
	 * @param values An object which implements Iterable
	 *
	 * @return The first item in the iterable object
	 */
	public static Object getFirst(Object values) {
		return getFirst(getIterable(values));
	}

	/**
	 * Returns the first item in an object which implements Iterable. If the object is null, does
	 * not implement Iterable, or is empty then the defaultValue argument is returned
	 *
	 * @param values An object which implements Iterable
	 * @param defaultValue A value to return if the object is null, does not implement Iterable, or
	 *                     is empty
	 *
	 * @return The first item in the iterable object or defaultValue if the object is null, does not
	 *         implement Iterable, or is empty
	 */
	public static Object getFirst(Object values, Object defaultValue) {
		return getFirst(getIterable(values), defaultValue);
	}

	/**
	 * Returns the last item in the list. If the list is null or empty then null is returned
	 *
	 * @param values A list
	 *
	 * @return The last item in the list
	 */
	public static Object getLast(List<Object> values) {
		return getLast(values, null);
	}

	/**
	 * Returns the last item in the list. If the list is null or empty then the defaultValue
	 * argument is returned
	 *
	 * @param values A list
	 * @param defaultValue A value to return if the list is null or empty
	 *
	 * @return The last item in the list or defaultValue if list is null or empty
	 */
	public static Object getLast(List<Object> values, Object defaultValue) {
		return ((values != null) && !values.isEmpty()) ? values[values.size() - 1] : defaultValue;
	}

	/**
	 * Returns the last item in the iterable. If the iterable is null or empty then null is
	 * returned
	 *
	 * @param values An iterable
	 *
	 * @return The last item in the list
	 */
	public static Object getLast(Iterable<Object> values) {
		return getLast(values, null);
	}

	/**
	 * Returns the last item in the iterable. If the iterable is null or empty then the
	 * defaultValue argument is returned
	 *
	 * @param values An iterable
	 * @param defaultValue A value to return if the iterable is null or empty
	 *
	 * @return The last item in the iterable or defaultValue if iterable is null or empty
	 */
	public static Object getLast(Iterable<Object> values, Object defaultValue) {
		Object returnValue = defaultValue;
		if (values != null) {
			Iterator<Object> it = values.iterator();
			while (it.hasNext()) {
				returnValue = it.next();
			}
		}
		return returnValue;
	}

	/**
	 * Returns the last item in an object which implements Iterable. If the object is null, does
	 * not implement Iterable, or is empty then null is returned
	 *
	 * @param values An object which implements Iterable
	 *
	 * @return The last item in the iterable object
	 */
	public static Object getLast(Object values) {
		return getLast(getIterable(values));
	}

	/**
	 * Returns the last item in an object which implements Iterable. If the object is null, does
	 * not implement Iterable, or is empty then the defaultValue argument is returned
	 *
	 * @param values An object which implements Iterable
	 * @param defaultValue A value to return if the object is null, does not implement Iterable, or
	 *                     is empty
	 *
	 * @return The last item in the iterable object or defaultValue if the object is null, does not
	 *         implement Iterable, or is empty
	 */
	public static Object getLast(Object values, Object defaultValue) {
		return getLast(getIterable(values), defaultValue);
	}

	/**
	 * Returns the index of the first occurence of the specified value within the list
	 *
	 * @param values A list
	 * @param valueToFind The value to find
	 *
	 * @return The index of the first occurence of the specified value or -1 if the value was not
	 *         found in the list
	 */
	public static Integer indexOf(List<Object> values, Object valueToFind) {
		Integer index = -1;
		if (values != null) {
			Integer size = values.size();
			for (Integer i = 0; i < size; i++) {
				Object value = values[i];
				if (value == valueToFind) {
					index = i;
					break;
				}
			}
		}
		return index;
	}

	/**
	 * Returns the index of the first occurence of the specified string, ignoring case, within the
	 * list
	 *
	 * @param values A list of strings
	 * @param valueToFind The string to find
	 *
	 * @return The index of the first occurence of the specified string or -1 if the value was not
	 *         found in the list
	 */
	public static Integer indexOfIgnoreCase(List<String> values, String valueToFind) {
		Integer index = -1;
		if (values != null) {
			Integer size = values.size();
			for (Integer i = 0; i < size; i++) {
				String value = values[i];

				if ((value == null) && (valueToFind == null)) {
					index = i;
					break;
				}

				if ((value != null) && (valueToFind != null)) {
					if (value.equalsIgnoreCase(valueToFind)) {
						index = i;
						break;
					}
				}
			}
		}
		return index;
	}

	/**
	 * Returns true if the list contains the specified value
	 *
	 * @param values A list
	 * @param valueToFind The value to find
	 *
	 * @return true if the list contains the value; otherwise, false
	 */
	public static Boolean contains(List<Object> values, Object valueToFind) {
		return (indexOf(values, valueToFind) != -1);
	}

	/**
	 * Returns true if the iterable contains the specified value. Note that this method must
	 * iterate through the collection until it either finds a match or reaches the end
	 *
	 * @param values An iterable
	 * @param valueToFind The value to find
	 *
	 * @return true if the iterable contains the value; otherwise, false
	 */
	public static Boolean contains(Iterable<Object> values, Object valueToFind) {
		Boolean found = false;
		if (values != null) {
			Iterator<Object> it = values.iterator();
			while (it.hasNext()) {
				Object value = it.next();
				if (value == valueToFind) {
					found = true;
					break;
				}
			}
		}
		return found;
	}

	/**
	 * Returns true if the object implements Iterable and contains the specified value. If the
	 * object does not implement Iterable then false is returned. If the object does implement
	 * Iterable then this method iterates through the collection until it either finds a match or
	 * reaches the end
	 *
	 * @param values An object which implements Iterable
	 * @param valueToFind The value to find
	 *
	 * @return true if the object implements Iterable and contains the value; otherwise, false
	 */
	public static Boolean contains(Object values, Object valueToFind) {
		return contains(getIterable(values), valueToFind);
	}

	/**
	 * Returns true if the list contains the specified value, ignoring case
	 *
	 * @param values A list of strings
	 * @param valueToFind The string to find
	 *
	 * @return true if the list contains the string; otherwise, false
	 */
	public static Boolean containsIgnoreCase(List<String> values, String valueToFind) {
		return (indexOfIgnoreCase(values, valueToFind) != -1);
	}

	/**
	 * Returns true if the set contains the specified value, ignoring case
	 *
	 * @param values A set of strings
	 * @param valueToFind The string to find
	 *
	 * @return true if the set contains the string; otherwise, false
	 */
	public static Boolean containsIgnoreCase(Set<String> values, String valueToFind) {
		Boolean found = false;
		if (values != null) {
			if (valueToFind == null) {
				found = values.contains(null);
			} else {
				for (String value : values) {
					if (valueToFind.equalsIgnoreCase(value)) {
						found = true;
						break;
					}
				}
			}
		}
		return found;
	}

	/**
	 * Adds an item to a list at a specific position. If index is null then the item is added at the
	 * end of the list. If index is positive and greater than the size of the list then the item is
	 * added at the end of the list. If index is positive and less than the size of the list then
	 * the item is added at that position. If index is negative then the item is added that many
	 * items from the end of the list.
	 *
	 * @param values A list
	 * @param valueToAdd The item to add
	 * @param index Index at which to add the item
	 *
	 * @return The size of the list
	 */
	public static Integer add(List<Object> values, Object valueToAdd, Integer index) {
		if (index == null) {
			index = values.size();
		} else if (index < 0) {
			if (Math.abs(index) > values.size()) {
				index = 0;
			} else {
				index = values.size() + index;
			}
		}

		if (index >= values.size()) {
			values.add(valueToAdd);
		} else {
			values.add(index, valueToAdd);
		}

		return values.size();
	}

	/**
	 * Copies values from one list to another
	 *
	 * @param source The source list
	 * @param destination The destination list
	 */
	public static void copy(List<Object> source, List<Object> destination) {
		copy(source, destination, null);
	}

	/**
	 * Copies a specified number of items from one list to another
	 *
	 * @param source The source list
	 * @param destination The destination list
	 * @param length The number of items to copy from source
	 */
	public static void copy(List<Object> source, List<Object> destination, Integer length) {
		copy(source, null, destination, null, length);
	}

	/**
	 * Copies a specified number of items from one list to another
	 *
	 * @param source The source list
	 * @param sourceIndex The index in source to start copying
	 * @param destination The destination list
	 * @param destinationIndex The index in destination to insert the copied items
	 * @param length The number of items to copy from source
	 */
	public static void copy(
		List<Object> source,
		Integer sourceIndex,
		List<Object> destination,
		Integer destinationIndex,
		Integer length
	) {
		if ((sourceIndex == null) || (sourceIndex < 0)) {
			sourceIndex = 0;
		}
		if ((destinationIndex == null) || (destinationIndex < 0)) {
			destinationIndex = 0;
		}
		if ((length == null) || (length < 0)) {
			length = source.size();
		}

		length = Math.min(length, source.size() - sourceIndex);

		for (Integer i = 0; i < length; i++) {
			Object sourceValue = source[sourceIndex + i];
			//add(destination, sourceValue, destinationIndex + i);
			if ((destinationIndex + i) < destination.size()) {
				destination.set(destinationIndex + i, sourceValue);
			} else {
				destination.add(sourceValue);
			}
		}
	}

	/**
	 * Converts a set of Boolean values to a list
	 *
	 * @param values A set
	 *
	 * @return A list
	 */
	public static List<Boolean> setToList(Set<Boolean> values) {
		return (values != null) ? new List<Boolean>(values) : new List<Boolean>();
	}

	/**
	 * Converts a set of Date values to a list
	 *
	 * @param values A set
	 *
	 * @return A list
	 */
	public static List<Date> setToList(Set<Date> values) {
		return (values != null) ? new List<Date>(values) : new List<Date>();
	}

	/**
	 * Converts a set of Datetime values to a list
	 *
	 * @param values A set
	 *
	 * @return A list
	 */
	public static List<Datetime> setToList(Set<Datetime> values) {
		return (values != null) ? new List<Datetime>(values) : new List<Datetime>();
	}

	/**
	 * Converts a set of Decimal values to a list
	 *
	 * @param values A set
	 *
	 * @return A list
	 */
	public static List<Decimal> setToList(Set<Decimal> values) {
		return (values != null) ? new List<Decimal>(values) : new List<Decimal>();
	}

	/**
	 * Converts a set of Double values to a list
	 *
	 * @param values A set
	 *
	 * @return A list
	 */
	public static List<Double> setToList(Set<Double> values) {
		return (values != null) ? new List<Double>(values) : new List<Double>();
	}

	/**
	 * Converts a set of Id values to a list
	 *
	 * @param values A set
	 *
	 * @return A list
	 */
	public static List<Id> setToList(Set<Id> values) {
		return (values != null) ? new List<Id>(values) : new List<Id>();
	}

	/**
	 * Converts a set of Integer values to a list
	 *
	 * @param values A set
	 *
	 * @return A list
	 */
	public static List<Integer> setToList(Set<Integer> values) {
		return (values != null) ? new List<Integer>(values) : new List<Integer>();
	}

	/**
	 * Converts a set of Long values to a list
	 *
	 * @param values A set
	 *
	 * @return A list
	 */
	public static List<Long> setToList(Set<Long> values) {
		return (values != null) ? new List<Long>(values) : new List<Long>();
	}

	/**
	 * Converts a set of objects to a list
	 *
	 * @param values A set
	 *
	 * @return A list
	 */
	public static List<Object> setToList(Set<Object> values) {
		return (values != null) ? new List<Object>(values) : new List<Object>();
	}

	/**
	 * Converts a set of String values to a list
	 *
	 * @param values A set
	 *
	 * @return A list
	 */
	public static List<String> setToList(Set<String> values) {
		return (values != null) ? new List<String>(values) : new List<String>();
	}

	/**
	 * Converts a set of SObject objects to a list
	 *
	 * @param values A set
	 *
	 * @return A list
	 */
	public static List<SObject> setToList(Set<SObject> values) {
		return (values != null) ? new List<SObject>(values) : new List<SObject>();
	}

	/**
	 * Converts a set of SObjectField objects to a list
	 *
	 * @param values A set
	 *
	 * @return A list
	 */
	public static List<Schema.SObjectField> setToList(Set<Schema.SObjectField> values) {
		return (
			(values != null)
			? new List<Schema.SObjectField>(values)
			: new List<Schema.SObjectField>()
		);
	}

	/**
	 * Converts a set of SObjectType objects to a list
	 *
	 * @param values A set
	 *
	 * @return A list
	 */
	public static List<Schema.SObjectType> setToList(Set<Schema.SObjectType> values) {
		return (
			(values != null)
			? new List<Schema.SObjectType>(values)
			: new List<Schema.SObjectType>()
		);
	}

	/**
	 * Converts a set of Time values to a list
	 *
	 * @param values A set
	 *
	 * @return A list
	 */
	public static List<Time> setToList(Set<Time> values) {
		return (values != null) ? new List<Time>(values) : new List<Time>();
	}

	/**
	 * Converts a list of Boolean values to a set
	 *
	 * @param values A list
	 *
	 * @return A set
	 */
	public static Set<Boolean> listToSet(List<Boolean> values) {
		return (values != null) ? new Set<Boolean>(values) : new Set<Boolean>();
	}

	/**
	 * Converts a list of Date values to a set
	 *
	 * @param values A list
	 *
	 * @return A set
	 */
	public static Set<Date> listToSet(List<Date> values) {
		return (values != null) ? new Set<Date>(values) : new Set<Date>();
	}

	/**
	 * Converts a list of Datetime values to a set
	 *
	 * @param values A list
	 *
	 * @return A set
	 */
	public static Set<Datetime> listToSet(List<Datetime> values) {
		return (values != null) ? new Set<Datetime>(values) : new Set<Datetime>();
	}

	/**
	 * Converts a list of Decimal values to a set
	 *
	 * @param values A list
	 *
	 * @return A set
	 */
	public static Set<Decimal> listToSet(List<Decimal> values) {
		return (values != null) ? new Set<Decimal>(values) : new Set<Decimal>();
	}

	/**
	 * Converts a list of Double values to a set
	 *
	 * @param values A list
	 *
	 * @return A set
	 */
	public static Set<Double> listToSet(List<Double> values) {
		return (values != null) ? new Set<Double>(values) : new Set<Double>();
	}

	/**
	 * Converts a list of Id values to a set
	 *
	 * @param values A list
	 *
	 * @return A set
	 */
	public static Set<Id> listToSet(List<Id> values) {
		return (values != null) ? new Set<Id>(values) : new Set<Id>();
	}

	/**
	 * Converts a list of Integer values to a set
	 *
	 * @param values A list
	 *
	 * @return A set
	 */
	public static Set<Integer> listToSet(List<Integer> values) {
		return (values != null) ? new Set<Integer>(values) : new Set<Integer>();
	}

	/**
	 * Converts a list of Long values to a set
	 *
	 * @param values A list
	 *
	 * @return A set
	 */
	public static Set<Long> listToSet(List<Long> values) {
		return (values != null) ? new Set<Long>(values) : new Set<Long>();
	}

	/**
	 * Converts a list of objects to a set
	 *
	 * @param values A list
	 *
	 * @return A set
	 */
	public static Set<Object> listToSet(List<Object> values) {
		return (values != null) ? new Set<Object>(values) : new Set<Object>();
	}

	/**
	 * Converts a list of String values to a set
	 *
	 * @param values A list
	 *
	 * @return A set
	 */
	public static Set<String> listToSet(List<String> values) {
		return (values != null) ? new Set<String>(values) : new Set<String>();
	}

	/**
	 * Converts a list of SObject objects to a set
	 *
	 * @param values A list
	 *
	 * @return A set
	 */
	public static Set<SObject> listToSet(List<SObject> values) {
		return (values != null) ? new Set<SObject>(values) : new Set<SObject>();
	}

	/**
	 * Converts a list of SObjectField objects to a set
	 *
	 * @param values A list
	 *
	 * @return A set
	 */
	public static Set<Schema.SObjectField> listToSet(List<Schema.SObjectField> values) {
		return (
			(values != null)
			? new Set<Schema.SObjectField>(values)
			: new Set<Schema.SObjectField>()
		);
	}

	/**
	 * Converts a list of SObjectType objects to a set
	 *
	 * @param values A list
	 *
	 * @return A set
	 */
	public static Set<Schema.SObjectType> listToSet(List<Schema.SObjectType> values) {
		return (
			(values != null)
			? new Set<Schema.SObjectType>(values)
			: new Set<Schema.SObjectType>()
		);
	}

	/**
	 * Converts a list of Time values to a set
	 *
	 * @param values A list
	 *
	 * @return A set
	 */
	public static Set<Time> listToSet(List<Time> values) {
		return (values != null) ? new Set<Time>(values) : new Set<Time>();
	}

	/**
	 * Converts a set of String values to a list keeping only the unique (case-insensitive) values
	 *
	 * @param values A set
	 *
	 * @return A list
	 */
	public static List<String> setToListIgnoreCase(Set<String> values) {
		List<String> uniqueValues = new List<String>();

		if (values != null) {
			Set<String> lowerCaseValues = new Set<String>();
			for (String value : values) {
				String lowerCaseValue = null;

				if (value != null) {
					lowerCaseValue = value.toLowerCase();
				}

				if (!lowerCaseValues.contains(lowerCaseValue)) {
					uniqueValues.add(value);
					lowerCaseValues.add(lowerCaseValue);
				}
			}
		}

		return uniqueValues;
	}

	/**
	 * Converts a list of String values to a set keeping only the unique (case-insensitive) values
	 *
	 * @param values A list
	 *
	 * @return A set
	 */
	public static Set<String> listToSetIgnoreCase(List<String> values) {
		return listToSet(setToListIgnoreCase(listToSet(values)));
	}
}