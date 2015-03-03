// var $gameeNative = require('./gamee_native.js');

var gamee = function(global) {
	'use strict';

	var gamee = {}, 
		score, 
		noop = function() {};
	
	function addDOMEvent(obj, event, fn) {
 		if (obj.addEventListener) {
			obj.addEventListener(event, fn, false);

		} else if (obj.attachEvent) {
			obj.attachEvent('on' + event, fn);
		}
	}

	function removeDOMEvent(obj, event, fn) {
		if (obj.removeEventListener) {
			obj.removeEventListener(event, fn, false);

		} else if (obj.detachEvent) {
			obj.detachEvent('on' + event, fn);
		}
	}

	function wrapKeyEvent(fn) {
		return function(ev) {
			var code;

			if (!ev) {
				ev = window.event;
			}

			if (ev.keyCode) {
				code = ev.keyCode;
			} else if (ev.which) {
				code = ev.which;
			}

			ev.keyCode = code;

			return fn(ev);
		};
	}

	gamee._keydown = function(fn) {
		addDOMEvent(global, 'keydown', wrapKeyEvent(fn));
	};

	gamee._keyup = function(fn) {
		addDOMEvent(global, 'keyup', wrapKeyEvent(fn));	
	};

	/**
	 * Score
	 */
	Object.defineProperty(gamee, 'score', {
		get: function() {
			return score;
		},

		set: function(newScore) {
			score = newScore;

			global.$gameeNative.updateScore(score);
		}
	});

	/**
	 * game over
	 */
	gamee.gameOver = function() {
		global.$gameeNative.gameOver();
	};

	/**
	 * game start
	 */
	gamee.gameStart = function() {
		global.$gameeNative.gameStart();
	};

	gamee.onPause   = noop;
	gamee.onStop    = noop;
	gamee.onRestart = noop;
	gamee.onMute    = noop;

	// *deprecated* for backward compatibility
	gamee.onUnpause = noop;
	// use onResume instead
	gamee.onResume = function() {
		gamee.onUnpause();
	};

	// gamee-web keyboard hooks
	if (global.$gameeNative.type === 'gamee-web') {
		gamee._keydown(function(ev) {
			switch(ev.keyCode) {
				case 80:  // p for pause
					gamee.onPause();
					$gameeNative.gamePaused();
					break;

				case 82: // r for restart
					gamee.onRestart();
					break;
			}
		});
	}
	
	return gamee;
}(this);
