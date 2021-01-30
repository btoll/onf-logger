##Test suite 'onf-logger'
- it -> 'should allow access to the underyling wrapped logger object'
- it -> 'should allow access to the underyling color package'

###(describe) 'aliases'
	 it -> 'should not create aliases by default'
	 it -> 'should create aliases if opting-in'
	 it -> 'should accept an object of custom aliases'

###(describe) 'formatting'
	 it -> 'should allow access to the formatter'

	(describe) 'date'

###(describe) 'log level'

	(describe) '#getLogLevel'
		 it -> 'should default to ALL'

	(describe) '#setLogLevel'
		 it -> 'should allow the level to be set to a single value'
		 it -> 'should allow the level to be set to an aggregate value'

	(describe) 'throttling the log level'
		 it -> 'should log below the set log level'
		 it -> 'should not log above the set log level'
		 it -> 'should not log anything when off'

###(describe) 'logging'

	(describe) 'colors'
		 it -> 'should allow colors to be disabled'
		 it -> 'should allow colors to be enabled'

	(describe) 'date'
		 it -> 'should allow the date to be disabled'
		 it -> 'should allow the date to be enabled'

	(describe) 'general logging'
		 it -> 'should prepend the error message with the type'
		 it -> 'should not prepend the error message with the type when `raw`'
		 it -> 'should pass all params through to the underlying logging implementation'
		 it -> 'should throw when calling a non-existent but previously-defined function'

###(describe) 'tpl'

	(describe) 'dateTpl'
		 it -> 'should default to {Y}-{m}-{d}'
		 it -> 'should allow for it to be set'

	(describe) 'timeTpl'
		 it -> 'should default to {H}:{i}:{s}.{ms}'
		 it -> 'should allow for it to be set'