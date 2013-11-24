# <center>Lua Tricks</center>

This post is a collection of a couple of neat "Lua tricks" I've learned over the years in my experience with Lua. They're a bunch of neat trivial tidbits that several programmers don't seem to know about. This content was made for the ComputerCraft mod and its users, but the topics I discuss here can be used in any place that uses Lua.

\*\***Note: This is not a Lua language tutorial. This topic is for if you're interested in learning about Lua's syntax in more detail.**

## Single-Quote and Multi-line Strings

Programmers coming from other languages usually assume strings can only be double-quoted. This is a reasonable assumption, as in most compiled languages, the single quote is reserved for characters. Lua, however, doesn't have a character value type, and allows you to use both double and single quotes for strings.

    str = "Hello World!"
	str = 'Hello World!'

They can be used interchangeably:

	str = 'A string with "double quotes"'
	str = "A string with 'single quotes'"

Another string syntax provided by lua is the double-braced multiline string.

	str = [[I am a string
	and I span
	multiple lines!
	I can have 'single' and "double" quotes!

	[=[
		Nesting is done by putting equal signs
		between the double braces.
		[===[
			You can do it as many times are you want.
		]===]
	]=]
	]]

This syntax is shared also by comments.
	
	-- a regular comment
	--[[
		A MULTILINE COMMENT!
		WOW
	]]

## String Functions

Lua has a very nice string library for you to perform operations on strings, such as string.sub, string.len, string.match, and others. Let's say we wanted a function to capitalize a word or sentence.

	function capitalize(str)
		-- lowercase the entire string
		str = string.lower(str)

		-- splice the first letter capitialized, then with the rest of the string
		str = string.upper(string.sub(1,1)) .. string.sub(2)
		return str
	end

Though typing the `string.` prefix so much can be rather redundant. To save a lot of typing, you can call the functions directly on the string, using the colon `:` syntax.

	function capitalize(str)
		return str:sub(1,1):upper() .. str:sub(2):lower()
	end

The function is written a little differently, but does the same thing in a much more compact fashion.

## String Length

Lua provides a string.len function for finding a string length, but I and many other Lua users find it easier to use the length operator, commonly used on tables.

	str = "Hello World!"
	print(str:len()) --> 12
	print(#str) --> 12

## Dropping Parentheses on Function Calls

When passing a single string or a single table to functions in Lua, you can choose to not use parentheses. In a lot of cases, this can make syntax much cleaner.

	print "Some text without using parentheses"

	someFunction { "I'm just a table!" }

Note that the first example only works when you pass in a single string literal, as in, `print "First string ".." a second string"` will produce an error.

## Variable Arguments

The print function is essentially able to take as many arguments as you can give it:

	values = {}
	for i=1, 100 do
		values[i] = i
	end

	print(unpack(values))

This will print 1 .. 100, all at once. How does print do this? Since Lua was made in C, you'd need to see the source code to find out. However, Lua gives us a syntax to do the exact same thing, the triple-dot syntax.

	function foo(...)
		-- do stuff
	end

After that, you can do multiple things: use the "arg" table given by `...`, or make your own.

	function foo(...)
		print(arg[3])
	end

	function foo2(...)
		local arguments = {...}
		print(arguments[3])
	end

Both these functions print the third argument given to them. Often when running a lua program, you can pass arguments to that program, and those arguments are captured in the same way. However the arg table is not created in this fashion; you have to make it yourself.

	local args = {...}
	print("Command line arguments: ", unpack(args))

Because of the way `...` works, you can also assign variables to `...`.

	local first, second = ...
	print("First: ", first, " Second: ", second)

This will give you a syntax similar to function parameters, but with program arguments.

## Iterators

Iterators are functions like pairs() and ipairs() that are used in `for..in..do` loops. You usually won't be needing to use an iterator function, but their usage can shorten some operations quite a bit. The concept of an iterator is relatively easy to grasp: it's simply a function that returns a non-nil value for each loop iteration, then returns a nil value to end the loop. For example, pairs() returns an iterator that continually returns a key and a value for a table, and when it can't find any more, it returns nil, and the loop ends. Here's an example using ComputerCraft's fs library, and the file.readLine function, which returns a line until it's done reading a file, and returns nil.

	local file = fs.open('my-data', 'r')
	local lines = {}
	
	-- the old way:
	while true do
		local line = file.readLine()
		if line then
			table.insert(lines, line)
		else
			file.close()
			break
		end
	end
	
	-- the new way:
	for line in file.readLine do
		table.insert(lines, line)
	end

**Note**: pairs() is not an iterator. It is a function that returns an iterator, which is why it is being called, as opposed to the example given here.

## Table Definitions

Depending on where you come from, you may find yourself using tables like so:

	object = {}
	object["child"] = {}
	object["child"]["x"] = 5
	object["child"]["y"] = 10

I consider this extremely bad practice, not only because it doesn't look very attractive, but indicing tables using strings is actually a little slower than using the dot syntax:

	object = {}
	object.child = {}
	object.child.x = 5
	object.child.y = 10

This looks much little nicer, but we could probably do better.

	object = {
		child = {
			x = 5;
			y = 10;
		};
	}

This example demonstrates Lua's wonderful table nesting syntax, and you would still access `object.child.x` like you normally would.

**Warning**: when doing this, you cannot access a property inside of itself. For example, this wouldn't work because `object` isn't actually defined yet.

	object = {
		child = {
			x = 5;
			y = object.child.x + 2;
		};
	}

You would need to set it after the table's creation, not during.

	object = {
		child = {
			x = 5;
		};
	}

	object.child.y = object.child.x + 2

Also note that string indices and the dot syntax can be used interchangeably, but the dot syntax cannot be used when the indice has a space.

	object = {
		value1 = "hello";
		["value2"] = "world";
		["value 3"] = "!";
	}

	print(object["value1"]) --> hello
	print(object.value2) --> world

	print(object.value 3) --> syntax error

## Concatenating Numbers!

When using the concatenation operator `..`, Lua converts both operands to strings (except in the case when one of them is nil). Therefore, concatenating numbers is easy:

	print(3 .. 3) --> 33

The result is, of course, a string, but an easy tonumber() fixes that.

## Booleans...?

Lua's booleans are incredibly flexible and work in strange ways. In fact, Lua conditional statements treat every non-nil or non-false value as true.

	if 0 then
		print "0 is true!"
	end

As you probably know, the `and` and `or` keywords are both used to manipulate booleans, but can be used with more than just `true` and `false`, and they work differently than you might think.

When using `and`, if the first value is non-nil/false, it returns the second value. Otherwise, it returns the first value.

	print(1 and 2) --> 2
	print(true and nil) --> nil

	print(false and true) --> false
	print(nil and true) --> nil

When using `or`, it returns the first value if the first value is non-nil/false. If the first value is nil or false, it returns the second value.

	print(1 or 2) --> 1
	print(nil or 2) --> 2
	print(false or nil) --> nil

Using this knowledge, we can emulate the ternary statement commonly found in many languages.

	var = value and 1 or 2

In this example, lua evaluates the `value and 1` statement first. If `value` is non-nil/false, `var` becomes 1. Otherwise, this part becomes false/nil, and the `or` statement is evaluated, making `var` 2.

`or` is also commonly used to make function defaults.

	function button(text, x, y, color)
		text = text or "Button"
		x = x or 0
		y = y or 0
		color = color or colors.white
		-- ...
	end

The `not` statement is also used in boolean manipulation, and it works exactly how you'd expect. `false` and `nil` are turned to `true`, and every non-nil/false value is turned to false. The easiest way of toggling a boolean:

	bool = not bool

And in ComputerCraft, toggling a redstone output:
	
	rs.setOutput("back", not rs.getOutput("back"))

## Metatables

Metatables aren't as much of a "lua trick" as they are a construct that makes Lua an extremely versitile language. Lua provides "metamethods", such as `__add`, `__sub`, `__call`, `__index` and others that allow you to give tables the behavior of other value types. Let's say you wanted to make a vector class, where adding two vectors would produce a new vector, where its parts are the sum of the added vectors. You would need to set the table's metatable using "setmetatable". This metatable contains all the metamethods you need to implement addition behavior. The setmetatable function also returns the table you've used.

	function Vector(x, y)
		return setmetatable({
			x = x, y = y;

			print = function(t) -- convenience for printing the vector's values
				print("(" .. t.x .. ", " .. t.y .. ")")
			end;
		}, {
			__add = function(v1, v2)
				return Vector(v1.x + v2.x, v1.y + v2.y)
			end;
		})
	end

	v1 = Vector(1, 2)
	v2 = Vector(2, 1)

	v3 = v1 + v2
	v3:print() --> (3, 3)

You can find out more about metatables and metamethods on the [Lua Users Wiki](http://lua-users.org/wiki/MetamethodsTutorial).
