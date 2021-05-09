#! deno run --location http://localhost --allow-read --allow-net

import "https://unpkg.com/mocha@7.2.0/mocha.js"
import { assert } from "https://deno.land/std@0.95.0/testing/asserts.ts";

// Faking a window for Mocha
mocha.setup({ ui: "bdd", reporter: "spec" })
mocha.checkLeaks()

const Rhost = await import('../rhost.js')

describe("color", function() {
	it("should convert all X11 color names to xterm", function() {
		Rhost.X11ColorNames.forEach(function(color) {
			assert(Rhost.color.x11ToIndex(color[0]) == color[1])
		})
	})
})

/**
 * And finally we run our tests, passing the onCompleted function
 * hook and setting some globals.
 */
mocha.run(function(failures) {
	if(failures > 0) {
		Deno.exit(1)
	}
	Deno.exit(0)
}).globals([])
