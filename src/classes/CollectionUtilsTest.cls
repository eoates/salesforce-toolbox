/**
 * Contains test methods for the CollectionUtils class
 */
@IsTest
private class CollectionUtilsTest {
	private static List<String> makeList(Integer howMany) {
		List<String> values = new List<String>();
		for (Integer i = 0; i < howMany; i++) {
			values.add('Test' + i);
		}
		return values;
	}

	private static Set<String> makeSet(Integer howMany) {
		Set<String> values = new Set<String>();
		for (Integer i = 0; i < howMany; i++) {
			values.add('Test' + i);
		}
		return values;
	}

	@IsTest
	static void isIterable_Null_False() {
		System.assertEquals(false, CollectionUtils.isIterable(null));
	}

	@IsTest
	static void isIterable_Primitive_False() {
		System.assertEquals(false, CollectionUtils.isIterable(true));
		System.assertEquals(false, CollectionUtils.isIterable(Date.today()));
		System.assertEquals(false, CollectionUtils.isIterable(Datetime.now()));
		System.assertEquals(false, CollectionUtils.isIterable((Decimal)0));
		System.assertEquals(false, CollectionUtils.isIterable((Double)0));
		System.assertEquals(false, CollectionUtils.isIterable(UserInfo.getUserId()));
		System.assertEquals(false, CollectionUtils.isIterable((Integer)0));
		System.assertEquals(false, CollectionUtils.isIterable((Long)0));
		System.assertEquals(false, CollectionUtils.isIterable('Test'));
	}

	@IsTest
	static void isIterable_List_True() {
		List<String> values = makeList(0);
		System.assertEquals(true, CollectionUtils.isIterable(values));
	}

	@IsTest
	static void isIterable_Set_True() {
		Set<String> values = makeSet(0);
		System.assertEquals(true, CollectionUtils.isIterable(values));
	}

	@IsTest
	static void isEmpty_EmptyList_True() {
		List<String> values = makeList(0);
		System.assertEquals(true, CollectionUtils.isEmpty(values));
	}

	@IsTest
	static void isEmpty_NonEmptyList_False() {
		List<String> values = makeList(2);
		System.assertEquals(false, CollectionUtils.isEmpty(values));
	}

	@IsTest
	static void isEmpty_EmptySet_True() {
		Set<String> values = makeSet(0);
		System.assertEquals(true, CollectionUtils.isEmpty(values));
	}

	@IsTest
	static void isEmpty_NonEmptySet_False() {
		Set<String> values = makeSet(2);
		System.assertEquals(false, CollectionUtils.isEmpty(values));
	}

	@IsTest
	static void getSize_EmptyList() {
		List<String> values = makeList(0);
		System.assertEquals(0, CollectionUtils.getSize(values));
	}

	@IsTest
	static void getSize_NonEmptyList() {
		List<String> values = makeList(2);
		System.assertEquals(values.size(), CollectionUtils.getSize(values));
	}

	@IsTest
	static void getSize_EmptySet() {
		Set<String> values = makeSet(0);
		System.assertEquals(0, CollectionUtils.getSize(values));
	}

	@IsTest
	static void getSize_NonEmptySet() {
		Set<String> values = makeSet(2);
		System.assertEquals(values.size(), CollectionUtils.getSize(values));
	}

	@IsTest
	static void getFirst_List() {
		System.assertEquals(null, CollectionUtils.getFirst((List<String>)null));
		System.assertEquals('Default', CollectionUtils.getFirst((List<String>)null, 'Default'));

		System.assertEquals(null, CollectionUtils.getFirst(makeList(0)));
		System.assertEquals('Default', CollectionUtils.getFirst(makeList(0), 'Default'));

		List<String> values = makeList(2);
		System.assertEquals(values[0], CollectionUtils.getFirst(values));
		System.assertEquals(values[0], CollectionUtils.getFirst(values, 'Default'));
	}

	@IsTest
	static void getFirst_Set() {
		System.assertEquals(null, CollectionUtils.getFirst((Set<String>)null));
		System.assertEquals('Default', CollectionUtils.getFirst((Set<String>)null, 'Default'));

		System.assertEquals(null, CollectionUtils.getFirst(makeSet(0)));
		System.assertEquals('Default', CollectionUtils.getFirst(makeSet(0), 'Default'));

		Set<String> values = makeSet(2);
		System.assertNotEquals(null, CollectionUtils.getFirst(values));
		System.assertNotEquals('Default', CollectionUtils.getFirst(values, 'Default'));
	}

	@IsTest
	static void getLast_List() {
		System.assertEquals(null, CollectionUtils.getLast((List<String>)null));
		System.assertEquals('Default', CollectionUtils.getLast((List<String>)null, 'Default'));

		System.assertEquals(null, CollectionUtils.getLast(makeList(0)));
		System.assertEquals('Default', CollectionUtils.getLast(makeList(0), 'Default'));

		List<String> values = makeList(2);
		System.assertEquals(values[values.size() - 1], CollectionUtils.getLast(values));
		System.assertEquals(values[values.size() - 1], CollectionUtils.getLast(values, 'Default'));
	}

	@IsTest
	static void getLast_Set() {
		System.assertEquals(null, CollectionUtils.getLast((Set<String>)null));
		System.assertEquals('Default', CollectionUtils.getLast((Set<String>)null, 'Default'));

		System.assertEquals(null, CollectionUtils.getLast(makeSet(0)));
		System.assertEquals('Default', CollectionUtils.getLast(makeSet(0), 'Default'));

		Set<String> values = makeSet(2);
		System.assertNotEquals(null, CollectionUtils.getLast(values));
		System.assertNotEquals('Default', CollectionUtils.getLast(values, 'Default'));
	}

	@IsTest
	static void indexOf_NullList() {
		System.assertEquals(-1, CollectionUtils.indexOf(null, 'Test0'));
	}

	@IsTest
	static void indexOf_EmptyList() {
		List<String> values = makeList(0);
		System.assertEquals(-1, CollectionUtils.indexOf(values, 'Test0'));
	}

	@IsTest
	static void indexOf_InvalidValue() {
		List<String> values = makeList(2);
		System.assertEquals(-1, CollectionUtils.indexOf(values, null));
	}

	@IsTest
	static void indexOf_ValidValue() {
		List<String> values = makeList(5);
		Integer indexToFind = 2;
		String valueToFind = values[indexToFind];
		System.assertEquals(indexToFind, CollectionUtils.indexOf(values, valueToFind));
	}

	@IsTest
	static void indexOfIgnoreCase_NullList() {
		System.assertEquals(-1, CollectionUtils.indexOfIgnoreCase(null, 'Test0'));
	}

	@IsTest
	static void indexOfIgnoreCase_EmptyList() {
		List<String> values = makeList(0);
		System.assertEquals(-1, CollectionUtils.indexOfIgnoreCase(values, 'Test0'));
	}

	@IsTest
	static void indexOfIgnoreCase_NullValue() {
		List<String> values = makeList(2);
		values.add(null);
		System.assertEquals(values.size() - 1, CollectionUtils.indexOfIgnoreCase(values, null));
	}

	@IsTest
	static void indexOfIgnoreCase_InvalidValue() {
		List<String> values = makeList(2);
		System.assertEquals(-1, CollectionUtils.indexOfIgnoreCase(values, null));
	}

	@IsTest
	static void indexOfIgnoreCase_ValidValue() {
		List<String> values = makeList(5);
		Integer indexToFind = 2;
		String valueToFind = values[indexToFind].toUpperCase();
		System.assertEquals(indexToFind, CollectionUtils.indexOfIgnoreCase(values, valueToFind));
	}

	@IsTest
	static void contains_List() {
		List<String> values = makeList(2);
		System.assertEquals(false, CollectionUtils.contains((List<String>)null, 'Test0'));
		System.assertEquals(false, CollectionUtils.contains(values, null));
		System.assertEquals(true, CollectionUtils.contains(values, 'Test0'));
	}

	@IsTest
	static void contains_Set() {
		Set<String> values = makeSet(2);
		System.assertEquals(false, CollectionUtils.contains((Set<String>)null, 'Test0'));
		System.assertEquals(false, CollectionUtils.contains(values, null));
		System.assertEquals(true, CollectionUtils.contains(values, 'Test0'));
	}

	@IsTest
	static void containsIgnoreCase_List() {
		List<String> values = makeList(2);
		System.assertEquals(false, CollectionUtils.containsIgnoreCase((List<String>)null, 'Test0'));
		System.assertEquals(false, CollectionUtils.containsIgnoreCase(values, null));
		System.assertEquals(true, CollectionUtils.containsIgnoreCase(values, 'Test0'));
		System.assertEquals(true, CollectionUtils.containsIgnoreCase(values, 'TEST0'));
		System.assertEquals(true, CollectionUtils.containsIgnoreCase(values, 'test0'));
		System.assertEquals(true, CollectionUtils.containsIgnoreCase(values, 'Test1'));
		System.assertEquals(true, CollectionUtils.containsIgnoreCase(values, 'TEST1'));
		System.assertEquals(true, CollectionUtils.containsIgnoreCase(values, 'test1'));
	}

	@IsTest
	static void containsIgnoreCase_Set() {
		Set<String> values = makeSet(2);
		System.assertEquals(false, CollectionUtils.containsIgnoreCase((Set<String>)null, 'Test0'));
		System.assertEquals(false, CollectionUtils.containsIgnoreCase(values, null));
		System.assertEquals(true, CollectionUtils.containsIgnoreCase(values, 'Test0'));
		System.assertEquals(true, CollectionUtils.containsIgnoreCase(values, 'TEST0'));
		System.assertEquals(true, CollectionUtils.containsIgnoreCase(values, 'test0'));
		System.assertEquals(true, CollectionUtils.containsIgnoreCase(values, 'Test1'));
		System.assertEquals(true, CollectionUtils.containsIgnoreCase(values, 'TEST1'));
		System.assertEquals(true, CollectionUtils.containsIgnoreCase(values, 'test1'));
	}

	@IsTest
	static void add_NullList_NullPointerException() {
		Boolean exceptionThrown = false;
		try {
			CollectionUtils.add(null, 'Test', null);
		} catch (NullPointerException e) {
			exceptionThrown = true;
		}
		System.assertEquals(true, exceptionThrown);
	}

	@IsTest
	static void add_NullIndex_AddAtEnd() {
		List<String> values = makeList(8);
		CollectionUtils.add(values, 'New Value', null);
		System.assertEquals('New Value', values[values.size() - 1]);
	}

	@IsTest
	static void add_PositiveIndex_LessThanSize_AddAtIndex() {
		List<String> values = makeList(8);
		CollectionUtils.add(values, 'New Value', 2);
		System.assertEquals('New Value', values[2]);
	}

	@IsTest
	static void add_PositiveIndex_GreaterThanSize_AddAtEnd() {
		List<String> values = makeList(8);
		CollectionUtils.add(values, 'New Value', 1000);
		System.assertEquals('New Value', values[values.size() - 1]);
	}

	@IsTest
	static void add_NegativeIndex_LessThanSize_AddAtIndex() {
		List<String> values = makeList(8);
		CollectionUtils.add(values, 'New Value', -2);
		System.assertEquals('New Value', values[6]);
	}

	@IsTest
	static void add_NegativeIndex_GreaterThanSize_AddAtStart() {
		List<String> values = makeList(8);
		CollectionUtils.add(values, 'New Value', -1000);
		System.assertEquals('New Value', values[0]);
	}

	@IsTest
	static void copy_NullSource_NullPointerException() {
		List<String> destination = makeList(2);

		Boolean exceptionThrown = false;
		try {
			CollectionUtils.copy(null, destination);
		} catch (NullPointerException e) {
			exceptionThrown = true;
		}
		System.assertEquals(true, exceptionThrown);
	}

	@IsTest
	static void copy_NullDestination_NullPointerException() {
		List<String> source = makeList(2);

		Boolean exceptionThrown = false;
		try {
			CollectionUtils.copy(source, null);
		} catch (NullPointerException e) {
			exceptionThrown = true;
		}
		System.assertEquals(true, exceptionThrown);
	}

	@IsTest
	static void copy_LengthNotSpecified() {
		List<String> source = new List<String>();
		source.add('Apple');
		source.add('Watermelon');
		source.add('Orange');
		source.add('Lime');
		source.add('Cantaloupe');

		List<String> destination = new List<String>();
		destination.add('Grape');
		destination.add('Blueberry');
		destination.add('Lemon');

		CollectionUtils.copy(source, destination);

		System.assertEquals('Apple', destination[0]);
		System.assertEquals('Watermelon', destination[1]);
		System.assertEquals('Orange', destination[2]);
		System.assertEquals('Lime', destination[3]);
		System.assertEquals('Cantaloupe', destination[4]);
	}

	@IsTest
	static void copy_LengthSpecified() {
		List<String> source = new List<String>();
		source.add('Apple');
		source.add('Watermelon');
		source.add('Orange');
		source.add('Lime');
		source.add('Cantaloupe');

		List<String> destination = new List<String>();
		destination.add('Grape');
		destination.add('Blueberry');
		destination.add('Lemon');

		CollectionUtils.copy(source, destination, 3);

		System.assertEquals('Apple', destination[0]);
		System.assertEquals('Watermelon', destination[1]);
		System.assertEquals('Orange', destination[2]);
	}

	@IsTest
	static void copy_Subset() {
		List<String> source = new List<String>();
		source.add('Apple');
		source.add('Watermelon');
		source.add('Orange');
		source.add('Lime');
		source.add('Cantaloupe');

		List<String> destination = new List<String>();
		destination.add('Grape');
		destination.add('Blueberry');
		destination.add('Lemon');

		CollectionUtils.copy(source, 1, destination, 2, 3);

		System.assertEquals('Grape', destination[0]);
		System.assertEquals('Blueberry', destination[1]);
		System.assertEquals('Watermelon', destination[2]);
		System.assertEquals('Orange', destination[3]);
		System.assertEquals('Lime', destination[4]);
	}

	@IsTest
	static void setToList_Boolean() {
		CollectionUtils.setToList((Set<Boolean>)null);
		CollectionUtils.setToList(new Set<Boolean>());
	}

	@IsTest
	static void setToList_Date() {
		CollectionUtils.setToList((Set<Date>)null);
		CollectionUtils.setToList(new Set<Date>());
	}

	@IsTest
	static void setToList_Datetime() {
		CollectionUtils.setToList((Set<Datetime>)null);
		CollectionUtils.setToList(new Set<Datetime>());
	}

	@IsTest
	static void setToList_Decimal() {
		CollectionUtils.setToList((Set<Decimal>)null);
		CollectionUtils.setToList(new Set<Decimal>());
	}

	@IsTest
	static void setToList_Double() {
		CollectionUtils.setToList((Set<Double>)null);
		CollectionUtils.setToList(new Set<Double>());
	}

	@IsTest
	static void setToList_Id() {
		CollectionUtils.setToList((Set<Id>)null);
		CollectionUtils.setToList(new Set<Id>());
	}

	@IsTest
	static void setToList_Integer() {
		CollectionUtils.setToList((Set<Integer>)null);
		CollectionUtils.setToList(new Set<Integer>());
	}

	@IsTest
	static void setToList_Long() {
		CollectionUtils.setToList((Set<Long>)null);
		CollectionUtils.setToList(new Set<Long>());
	}

	@IsTest
	static void setToList_Object() {
		CollectionUtils.setToList((Set<Object>)null);
		CollectionUtils.setToList(new Set<Object>());
	}

	@IsTest
	static void setToList_String() {
		CollectionUtils.setToList((Set<String>)null);
		CollectionUtils.setToList(new Set<String>());
	}

	@IsTest
	static void setToList_SObject() {
		CollectionUtils.setToList((Set<SObject>)null);
		CollectionUtils.setToList(new Set<SObject>());
	}

	@IsTest
	static void setToList_SObjectField() {
		CollectionUtils.setToList((Set<Schema.SObjectField>)null);
		CollectionUtils.setToList(new Set<Schema.SObjectField>());
	}

	@IsTest
	static void setToList_SObjectType() {
		CollectionUtils.setToList((Set<Schema.SObjectType>)null);
		CollectionUtils.setToList(new Set<Schema.SObjectType>());
	}

	@IsTest
	static void setToList_Time() {
		CollectionUtils.setToList((Set<Time>)null);
		CollectionUtils.setToList(new Set<Time>());
	}

	@IsTest
	static void setToListIgnoreCase_NonEmptyList() {
		Set<String> s = new Set<String>();
		s.add('Foo');
		s.add('foo');
		s.add('FOO');
		s.add('BaR');
		s.add('bar');
		s.add('Bar');

		List<String> l = CollectionUtils.setToListIgnoreCase(s);
		System.assertEquals(2, l.size());
		System.assertEquals(true, CollectionUtils.containsIgnoreCase(l, 'Foo'));
		System.assertEquals(true, CollectionUtils.containsIgnoreCase(l, 'Bar'));
	}

	@IsTest
	static void listToSet_Boolean() {
		CollectionUtils.listToSet((List<Boolean>)null);
		CollectionUtils.listToSet(new List<Boolean>());
	}

	@IsTest
	static void listToSet_Date() {
		CollectionUtils.listToSet((List<Date>)null);
		CollectionUtils.listToSet(new List<Date>());
	}

	@IsTest
	static void listToSet_Datetime() {
		CollectionUtils.listToSet((List<Datetime>)null);
		CollectionUtils.listToSet(new List<Datetime>());
	}

	@IsTest
	static void listToSet_Decimal() {
		CollectionUtils.listToSet((List<Decimal>)null);
		CollectionUtils.listToSet(new List<Decimal>());
	}

	@IsTest
	static void listToSet_Double() {
		CollectionUtils.listToSet((List<Double>)null);
		CollectionUtils.listToSet(new List<Double>());
	}

	@IsTest
	static void listToSet_Id() {
		CollectionUtils.listToSet((List<Id>)null);
		CollectionUtils.listToSet(new List<Id>());
	}

	@IsTest
	static void listToSet_Integer() {
		CollectionUtils.listToSet((List<Integer>)null);
		CollectionUtils.listToSet(new List<Integer>());
	}

	@IsTest
	static void listToSet_Long() {
		CollectionUtils.listToSet((List<Long>)null);
		CollectionUtils.listToSet(new List<Long>());
	}

	@IsTest
	static void listToSet_Object() {
		CollectionUtils.listToSet((List<Object>)null);
		CollectionUtils.listToSet(new List<Object>());
	}

	@IsTest
	static void listToSet_String() {
		CollectionUtils.listToSet((List<String>)null);
		CollectionUtils.listToSet(new List<String>());
	}

	@IsTest
	static void listToSet_SObject() {
		CollectionUtils.listToSet((List<SObject>)null);
		CollectionUtils.listToSet(new List<SObject>());
	}

	@IsTest
	static void listToSet_SObjectField() {
		CollectionUtils.listToSet((List<Schema.SObjectField>)null);
		CollectionUtils.listToSet(new List<Schema.SObjectField>());
	}

	@IsTest
	static void listToSet_SObjectType() {
		CollectionUtils.listToSet((List<Schema.SObjectType>)null);
		CollectionUtils.listToSet(new List<Schema.SObjectType>());
	}

	@IsTest
	static void listToSet_Time() {
		CollectionUtils.listToSet((List<Time>)null);
		CollectionUtils.listToSet(new List<Time>());
	}

	@IsTest
	static void listToSetIgnoreCase_NullList() {
		Set<String> s = CollectionUtils.listToSetIgnoreCase(null);
		System.assertEquals(0, s.size());
	}

	@IsTest
	static void listToSetIgnoreCase_NonEmptyList() {
		List<String> l = new List<String>();
		l.add('Foo');
		l.add('foo');
		l.add('FOO');
		l.add('BaR');
		l.add('bar');
		l.add('Bar');

		Set<String> s = CollectionUtils.listToSetIgnoreCase(l);
		System.assertEquals(2, s.size());
		System.assertEquals(true, CollectionUtils.containsIgnoreCase(s, 'Foo'));
		System.assertEquals(true, CollectionUtils.containsIgnoreCase(s, 'Bar'));
	}
}