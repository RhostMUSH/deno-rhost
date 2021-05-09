/* Processing the environment variables sent by Rhost */

export function environment() {
	var version = Deno.env.get('MUSH_VERSION')
	var playerRef = Deno.env.get('MUSH_PLAYER')
	var causeRef = Deno.env.get('MUSH_CAUSE')
	var callerRef = Deno.env.get('MUSH_CALLER')
	var ownerRef = Deno.env.get('MUSH_OWNER')
	var objIds = Deno.env.get('MUSH_OBJID').split(' ').filter(x => x != "")
	var playerFlags = Deno.env.get('MUSH_FLAGS').split(' ').filter(x => x != "")
	var playerToggles = Deno.env.get('MUSH_TOGGLES').split(' ').filter(x => x != "")
	var playerTotems = Deno.env.get('MUSH_TOTEMS').split(' ').filter(x => x != "")
	var ownerFlags = Deno.env.get('MUSH_OWNERFLAGS').split(' ').filter(x => x != "")
	var ownerToggles = Deno.env.get('MUSH_OWNERTOGGLES').split(' ').filter(x => x != "")
	var ownerTotems = Deno.env.get('MUSH_OWNERTOTEMS').split(' ').filter(x => x != "")

	var player = {
		dbref: playerRef.split(' ')[0],
		name: playerRef.split(' ')[1],
		objid: objIds[0],
		flags: playerFlags,
		toggles: playerToggles,
		totems: playerTotems
	}

	var cause = {
		dbref: causeRef.split(' ')[0],
		name: causeRef.split(' ')[1],
		objid: objIds[1]
	}

	var caller = {
		dbref: callerRef.split(' ')[0],
		name: callerRef.split(' ')[1],
		objid: objIds[2]
	}

	var owner = {
		dbref: ownerRef.split(' ')[0],
		name: ownerRef.split(' ')[1],
		objid: objIds[3],
		flags: ownerFlags,
		toggles: ownerToggles,
		totems: ownerTotems
	}

	var envObj = Deno.env.toObject()
	var registers = []
	
	Object.keys(envObj).filter(key => key.match(/^MUSHQ_/)).forEach(function(key) {
		var reg = key.replace("MUSHQ_", "")
		var name = Deno.env.get(`MUSHQN_${reg}`)
		var value = Deno.env.get(key)
		registers.push({
			register: reg,
			name: name,
			value: value
		})
	})

	var vars = {}
	var mushlVars = Deno.env.get("MUSHL_VARS")
	if(mushlVars) {
		mushlVars.split(" ").forEach(function(key) {
			vars[key] = Deno.env.get(`MUSHV_${key}`)
		})
	}

	return {
		version: version,
		player: player,
		cause: cause,
		caller: caller,
		owner: owner,
		registers: registers,
		vars: vars
	}
}

/* Output back to Rhost, Rhost-encoding all Unicode code points above low ASCII */

export function print(str) {
	if(typeof str != "string") {
		str = Deno.inspect(str)
	}
	var rhostEncodedString = str.split("").map(function(c) {
		var cp = c.codePointAt(0)
		if(cp > 127) {
			cp = cp.toString(0x10).padStart(4, '0')
			return `%<u${cp}>`
		}
		return c
	}).join('')
	console.log(rhostEncodedString)
}

/* Colors */
export const XTermColors = [
	{ index: 0, html: "000000", hsv: { hue: 0, saturation: 0, value: 0 } },
	{ index: 1, html: "800000", hsv: { hue: 0, saturation: 1, value: 0.5019607843137255 } },
	{ index: 2, html: "008000", hsv: { hue: 120, saturation: 1, value: 0.5019607843137255 } },
	{ index: 3, html: "808000", hsv: { hue: 60, saturation: 1, value: 0.5019607843137255 } },
	{ index: 4, html: "000080", hsv: { hue: 240, saturation: 1, value: 0.5019607843137255 } },
	{ index: 5, html: "800080", hsv: { hue: 300, saturation: 1, value: 0.5019607843137255 } },
	{ index: 6, html: "008080", hsv: { hue: 180, saturation: 1, value: 0.5019607843137255 } },
	{ index: 7, html: "c0c0c0", hsv: { hue: 0, saturation: 0, value: 0.7529411764705882 } },
	{ index: 8, html: "808080", hsv: { hue: 0, saturation: 0, value: 0.5019607843137255 } },
	{ index: 9, html: "ff0000", hsv: { hue: 0, saturation: 1, value: 1 } },
	{ index: 10, html: "00ff00", hsv: { hue: 120, saturation: 1, value: 1 } },
	{ index: 11, html: "ffff00", hsv: { hue: 60, saturation: 1, value: 1 } },
	{ index: 12, html: "0000ff", hsv: { hue: 240, saturation: 1, value: 1 } },
	{ index: 13, html: "ff00ff", hsv: { hue: 300, saturation: 1, value: 1 } },
	{ index: 14, html: "00ffff", hsv: { hue: 180, saturation: 1, value: 1 } },
	{ index: 15, html: "ffffff", hsv: { hue: 0, saturation: 0, value: 1 } },
	{ index: 16, html: "000000", hsv: { hue: 0, saturation: 0, value: 0 } },
	{ index: 17, html: "00005f", hsv: { hue: 240, saturation: 1, value: 0.37254901960784315 } },
	{ index: 18, html: "000087", hsv: { hue: 240, saturation: 1, value: 0.5294117647058824 } },
	{ index: 19, html: "0000af", hsv: { hue: 240, saturation: 1, value: 0.6862745098039216 } },
	{ index: 20, html: "0000d7", hsv: { hue: 240, saturation: 1, value: 0.8431372549019608 } },
	{ index: 21, html: "0000ff", hsv: { hue: 240, saturation: 1, value: 1 } },
	{ index: 22, html: "005f00", hsv: { hue: 120, saturation: 1, value: 0.37254901960784315 } },
	{ index: 23, html: "005f5f", hsv: { hue: 180, saturation: 1, value: 0.37254901960784315 } },
	{ index: 24, html: "005f87", hsv: { hue: 197.77777777777777, saturation: 1, value: 0.5294117647058824 } },
	{ index: 25, html: "005faf", hsv: { hue: 207.42857142857144, saturation: 1, value: 0.6862745098039216 } },
	{ index: 26, html: "005fd7", hsv: { hue: 213.48837209302326, saturation: 1, value: 0.8431372549019608 } },
	{ index: 27, html: "005fff", hsv: { hue: 217.64705882352942, saturation: 1, value: 1 } },
	{ index: 28, html: "008700", hsv: { hue: 120, saturation: 1, value: 0.5294117647058824 } },
	{ index: 29, html: "00875f", hsv: { hue: 162.22222222222223, saturation: 1, value: 0.5294117647058824 } },
	{ index: 30, html: "008787", hsv: { hue: 180, saturation: 1, value: 0.5294117647058824 } },
	{ index: 31, html: "0087af", hsv: { hue: 193.71428571428572, saturation: 1, value: 0.6862745098039216 } },
	{ index: 32, html: "0087d7", hsv: { hue: 202.32558139534882, saturation: 1, value: 0.8431372549019608 } },
	{ index: 33, html: "0087ff", hsv: { hue: 208.23529411764707, saturation: 1, value: 1 } },
	{ index: 34, html: "00af00", hsv: { hue: 120, saturation: 1, value: 0.6862745098039216 } },
	{ index: 35, html: "00af5f", hsv: { hue: 152.57142857142856, saturation: 1, value: 0.6862745098039216 } },
	{ index: 36, html: "00af87", hsv: { hue: 166.28571428571428, saturation: 1, value: 0.6862745098039216 } },
	{ index: 37, html: "00afaf", hsv: { hue: 180, saturation: 1, value: 0.6862745098039216 } },
	{ index: 38, html: "00afd7", hsv: { hue: 191.1627906976744, saturation: 1, value: 0.8431372549019608 } },
	{ index: 39, html: "00afff", hsv: { hue: 198.8235294117647, saturation: 1, value: 1 } },
	{ index: 40, html: "00d700", hsv: { hue: 120, saturation: 1, value: 0.8431372549019608 } },
	{ index: 41, html: "00d75f", hsv: { hue: 146.51162790697674, saturation: 1, value: 0.8431372549019608 } },
	{ index: 42, html: "00d787", hsv: { hue: 157.67441860465118, saturation: 1, value: 0.8431372549019608 } },
	{ index: 43, html: "00d7af", hsv: { hue: 168.8372093023256, saturation: 1, value: 0.8431372549019608 } },
	{ index: 44, html: "00d7d7", hsv: { hue: 180, saturation: 1, value: 0.8431372549019608 } },
	{ index: 45, html: "00d7ff", hsv: { hue: 189.41176470588235, saturation: 1, value: 1 } },
	{ index: 46, html: "00ff00", hsv: { hue: 120, saturation: 1, value: 1 } },
	{ index: 47, html: "00ff5f", hsv: { hue: 142.35294117647058, saturation: 1, value: 1 } },
	{ index: 48, html: "00ff87", hsv: { hue: 151.76470588235293, saturation: 1, value: 1 } },
	{ index: 49, html: "00ffaf", hsv: { hue: 161.1764705882353, saturation: 1, value: 1 } },
	{ index: 50, html: "00ffd7", hsv: { hue: 170.58823529411765, saturation: 1, value: 1 } },
	{ index: 51, html: "00ffff", hsv: { hue: 180, saturation: 1, value: 1 } },
	{ index: 52, html: "5f0000", hsv: { hue: 0, saturation: 1, value: 0.37254901960784315 } },
	{ index: 53, html: "5f005f", hsv: { hue: 300, saturation: 1, value: 0.37254901960784315 } },
	{ index: 54, html: "5f0087", hsv: { hue: 282.22222222222223, saturation: 1, value: 0.5294117647058824 } },
	{ index: 55, html: "5f00af", hsv: { hue: 272.57142857142856, saturation: 1, value: 0.6862745098039216 } },
	{ index: 56, html: "5f00d7", hsv: { hue: 266.51162790697674, saturation: 1, value: 0.8431372549019608 } },
	{ index: 57, html: "5f00ff", hsv: { hue: 262.3529411764706, saturation: 1, value: 1 } },
	{ index: 58, html: "5f5f00", hsv: { hue: 60, saturation: 1, value: 0.37254901960784315 } },
	{ index: 59, html: "5f5f5f", hsv: { hue: 0, saturation: 0, value: 0.37254901960784315 } },
	{ index: 60, html: "5f5f87", hsv: { hue: 240, saturation: 0.2962962962962963, value: 0.5294117647058824 } },
	{ index: 61, html: "5f5faf", hsv: { hue: 240, saturation: 0.45714285714285713, value: 0.6862745098039216 } },
	{ index: 62, html: "5f5fd7", hsv: { hue: 240, saturation: 0.5581395348837209, value: 0.8431372549019608 } },
	{ index: 63, html: "5f5fff", hsv: { hue: 240, saturation: 0.6274509803921569, value: 1 } },
	{ index: 64, html: "5f8700", hsv: { hue: 77.77777777777777, saturation: 1, value: 0.5294117647058824 } },
	{ index: 65, html: "5f875f", hsv: { hue: 120, saturation: 0.2962962962962963, value: 0.5294117647058824 } },
	{ index: 66, html: "5f8787", hsv: { hue: 180, saturation: 0.2962962962962963, value: 0.5294117647058824 } },
	{ index: 67, html: "5f87af", hsv: { hue: 210, saturation: 0.45714285714285713, value: 0.6862745098039216 } },
	{ index: 68, html: "5f87d7", hsv: { hue: 220, saturation: 0.5581395348837209, value: 0.8431372549019608 } },
	{ index: 69, html: "5f87ff", hsv: { hue: 225, saturation: 0.6274509803921569, value: 1 } },
	{ index: 70, html: "5faf00", hsv: { hue: 87.42857142857144, saturation: 1, value: 0.6862745098039216 } },
	{ index: 71, html: "5faf5f", hsv: { hue: 120, saturation: 0.45714285714285713, value: 0.6862745098039216 } },
	{ index: 72, html: "5faf87", hsv: { hue: 150, saturation: 0.45714285714285713, value: 0.6862745098039216 } },
	{ index: 73, html: "5fafaf", hsv: { hue: 180, saturation: 0.45714285714285713, value: 0.6862745098039216 } },
	{ index: 74, html: "5fafd7", hsv: { hue: 200, saturation: 0.5581395348837209, value: 0.8431372549019608 } },
	{ index: 75, html: "5fafff", hsv: { hue: 210, saturation: 0.6274509803921569, value: 1 } },
	{ index: 76, html: "5fd700", hsv: { hue: 93.48837209302326, saturation: 1, value: 0.8431372549019608 } },
	{ index: 77, html: "5fd75f", hsv: { hue: 120, saturation: 0.5581395348837209, value: 0.8431372549019608 } },
	{ index: 78, html: "5fd787", hsv: { hue: 140, saturation: 0.5581395348837209, value: 0.8431372549019608 } },
	{ index: 79, html: "5fd7af", hsv: { hue: 160, saturation: 0.5581395348837209, value: 0.8431372549019608 } },
	{ index: 80, html: "5fd7d7", hsv: { hue: 180, saturation: 0.5581395348837209, value: 0.8431372549019608 } },
	{ index: 81, html: "5fd7ff", hsv: { hue: 195, saturation: 0.6274509803921569, value: 1 } },
	{ index: 82, html: "5fff00", hsv: { hue: 97.6470588235294, saturation: 1, value: 1 } },
	{ index: 83, html: "5fff5f", hsv: { hue: 120, saturation: 0.6274509803921569, value: 1 } },
	{ index: 84, html: "5fff87", hsv: { hue: 135, saturation: 0.6274509803921569, value: 1 } },
	{ index: 85, html: "5fffaf", hsv: { hue: 150, saturation: 0.6274509803921569, value: 1 } },
	{ index: 86, html: "5fffd7", hsv: { hue: 165, saturation: 0.6274509803921569, value: 1 } },
	{ index: 87, html: "5fffff", hsv: { hue: 180, saturation: 0.6274509803921569, value: 1 } },
	{ index: 88, html: "870000", hsv: { hue: 0, saturation: 1, value: 0.5294117647058824 } },
	{ index: 89, html: "87005f", hsv: { hue: 317.77777777777777, saturation: 1, value: 0.5294117647058824 } },
	{ index: 90, html: "870087", hsv: { hue: 300, saturation: 1, value: 0.5294117647058824 } },
	{ index: 91, html: "8700af", hsv: { hue: 286.2857142857143, saturation: 1, value: 0.6862745098039216 } },
	{ index: 92, html: "8700d7", hsv: { hue: 277.6744186046512, saturation: 1, value: 0.8431372549019608 } },
	{ index: 93, html: "8700ff", hsv: { hue: 271.7647058823529, saturation: 1, value: 1 } },
	{ index: 94, html: "875f00", hsv: { hue: 42.22222222222222, saturation: 1, value: 0.5294117647058824 } },
	{ index: 95, html: "875f5f", hsv: { hue: 0, saturation: 0.2962962962962963, value: 0.5294117647058824 } },
	{ index: 96, html: "875f87", hsv: { hue: 300, saturation: 0.2962962962962963, value: 0.5294117647058824 } },
	{ index: 97, html: "875faf", hsv: { hue: 270, saturation: 0.45714285714285713, value: 0.6862745098039216 } },
	{ index: 98, html: "875fd7", hsv: { hue: 260, saturation: 0.5581395348837209, value: 0.8431372549019608 } },
	{ index: 99, html: "875fff", hsv: { hue: 255, saturation: 0.6274509803921569, value: 1 } },
	{ index: 100, html: "878700", hsv: { hue: 60, saturation: 1, value: 0.5294117647058824 } },
	{ index: 101, html: "87875f", hsv: { hue: 60, saturation: 0.2962962962962963, value: 0.5294117647058824 } },
	{ index: 102, html: "878787", hsv: { hue: 0, saturation: 0, value: 0.5294117647058824 } },
	{ index: 103, html: "8787af", hsv: { hue: 240, saturation: 0.22857142857142856, value: 0.6862745098039216 } },
	{ index: 104, html: "8787d7", hsv: { hue: 240, saturation: 0.37209302325581395, value: 0.8431372549019608 } },
	{ index: 105, html: "8787ff", hsv: { hue: 240, saturation: 0.47058823529411764, value: 1 } },
	{ index: 106, html: "87af00", hsv: { hue: 73.71428571428572, saturation: 1, value: 0.6862745098039216 } },
	{ index: 107, html: "87af5f", hsv: { hue: 90, saturation: 0.45714285714285713, value: 0.6862745098039216 } },
	{ index: 108, html: "87af87", hsv: { hue: 120, saturation: 0.22857142857142856, value: 0.6862745098039216 } },
	{ index: 109, html: "87afaf", hsv: { hue: 180, saturation: 0.22857142857142856, value: 0.6862745098039216 } },
	{ index: 110, html: "87afd7", hsv: { hue: 210, saturation: 0.37209302325581395, value: 0.8431372549019608 } },
	{ index: 111, html: "87afff", hsv: { hue: 220, saturation: 0.47058823529411764, value: 1 } },
	{ index: 112, html: "87d700", hsv: { hue: 82.32558139534883, saturation: 1, value: 0.8431372549019608 } },
	{ index: 113, html: "87d75f", hsv: { hue: 100, saturation: 0.5581395348837209, value: 0.8431372549019608 } },
	{ index: 114, html: "87d787", hsv: { hue: 120, saturation: 0.37209302325581395, value: 0.8431372549019608 } },
	{ index: 115, html: "87d7af", hsv: { hue: 150, saturation: 0.37209302325581395, value: 0.8431372549019608 } },
	{ index: 116, html: "87d7d7", hsv: { hue: 180, saturation: 0.37209302325581395, value: 0.8431372549019608 } },
	{ index: 117, html: "87d7ff", hsv: { hue: 200, saturation: 0.47058823529411764, value: 1 } },
	{ index: 118, html: "87ff00", hsv: { hue: 88.23529411764707, saturation: 1, value: 1 } },
	{ index: 119, html: "87ff5f", hsv: { hue: 105, saturation: 0.6274509803921569, value: 1 } },
	{ index: 120, html: "87ff87", hsv: { hue: 120, saturation: 0.47058823529411764, value: 1 } },
	{ index: 121, html: "87ffaf", hsv: { hue: 140, saturation: 0.47058823529411764, value: 1 } },
	{ index: 122, html: "87ffd7", hsv: { hue: 160, saturation: 0.47058823529411764, value: 1 } },
	{ index: 123, html: "87ffff", hsv: { hue: 180, saturation: 0.47058823529411764, value: 1 } },
	{ index: 124, html: "af0000", hsv: { hue: 0, saturation: 1, value: 0.6862745098039216 } },
	{ index: 125, html: "af005f", hsv: { hue: 327.42857142857144, saturation: 1, value: 0.6862745098039216 } },
	{ index: 126, html: "af0087", hsv: { hue: 313.7142857142857, saturation: 1, value: 0.6862745098039216 } },
	{ index: 127, html: "af00af", hsv: { hue: 300, saturation: 1, value: 0.6862745098039216 } },
	{ index: 128, html: "af00d7", hsv: { hue: 288.83720930232556, saturation: 1, value: 0.8431372549019608 } },
	{ index: 129, html: "af00ff", hsv: { hue: 281.1764705882353, saturation: 1, value: 1 } },
	{ index: 130, html: "af5f00", hsv: { hue: 32.57142857142857, saturation: 1, value: 0.6862745098039216 } },
	{ index: 131, html: "af5f5f", hsv: { hue: 0, saturation: 0.45714285714285713, value: 0.6862745098039216 } },
	{ index: 132, html: "af5f87", hsv: { hue: 330, saturation: 0.45714285714285713, value: 0.6862745098039216 } },
	{ index: 133, html: "af5faf", hsv: { hue: 300, saturation: 0.45714285714285713, value: 0.6862745098039216 } },
	{ index: 134, html: "af5fd7", hsv: { hue: 280, saturation: 0.5581395348837209, value: 0.8431372549019608 } },
	{ index: 135, html: "af5fff", hsv: { hue: 270, saturation: 0.6274509803921569, value: 1 } },
	{ index: 136, html: "af8700", hsv: { hue: 46.285714285714285, saturation: 1, value: 0.6862745098039216 } },
	{ index: 137, html: "af875f", hsv: { hue: 30, saturation: 0.45714285714285713, value: 0.6862745098039216 } },
	{ index: 138, html: "af8787", hsv: { hue: 0, saturation: 0.22857142857142856, value: 0.6862745098039216 } },
	{ index: 139, html: "af87af", hsv: { hue: 300, saturation: 0.22857142857142856, value: 0.6862745098039216 } },
	{ index: 140, html: "af87d7", hsv: { hue: 270, saturation: 0.37209302325581395, value: 0.8431372549019608 } },
	{ index: 141, html: "af87ff", hsv: { hue: 260, saturation: 0.47058823529411764, value: 1 } },
	{ index: 142, html: "afaf00", hsv: { hue: 60, saturation: 1, value: 0.6862745098039216 } },
	{ index: 143, html: "afaf5f", hsv: { hue: 60, saturation: 0.45714285714285713, value: 0.6862745098039216 } },
	{ index: 144, html: "afaf87", hsv: { hue: 60, saturation: 0.22857142857142856, value: 0.6862745098039216 } },
	{ index: 145, html: "afafaf", hsv: { hue: 0, saturation: 0, value: 0.6862745098039216 } },
	{ index: 146, html: "afafd7", hsv: { hue: 240, saturation: 0.18604651162790697, value: 0.8431372549019608 } },
	{ index: 147, html: "afafff", hsv: { hue: 240, saturation: 0.3137254901960784, value: 1 } },
	{ index: 148, html: "afd700", hsv: { hue: 71.16279069767441, saturation: 1, value: 0.8431372549019608 } },
	{ index: 149, html: "afd75f", hsv: { hue: 80.00000000000001, saturation: 0.5581395348837209, value: 0.8431372549019608 } },
	{ index: 150, html: "afd787", hsv: { hue: 90, saturation: 0.37209302325581395, value: 0.8431372549019608 } },
	{ index: 151, html: "afd7af", hsv: { hue: 120, saturation: 0.18604651162790697, value: 0.8431372549019608 } },
	{ index: 152, html: "afd7d7", hsv: { hue: 180, saturation: 0.18604651162790697, value: 0.8431372549019608 } },
	{ index: 153, html: "afd7ff", hsv: { hue: 210, saturation: 0.3137254901960784, value: 1 } },
	{ index: 154, html: "afff00", hsv: { hue: 78.82352941176471, saturation: 1, value: 1 } },
	{ index: 155, html: "afff5f", hsv: { hue: 90, saturation: 0.6274509803921569, value: 1 } },
	{ index: 156, html: "afff87", hsv: { hue: 100, saturation: 0.47058823529411764, value: 1 } },
	{ index: 157, html: "afffaf", hsv: { hue: 120, saturation: 0.3137254901960784, value: 1 } },
	{ index: 158, html: "afffd7", hsv: { hue: 150, saturation: 0.3137254901960784, value: 1 } },
	{ index: 159, html: "afffff", hsv: { hue: 180, saturation: 0.3137254901960784, value: 1 } },
	{ index: 160, html: "d70000", hsv: { hue: 0, saturation: 1, value: 0.8431372549019608 } },
	{ index: 161, html: "d7005f", hsv: { hue: 333.48837209302326, saturation: 1, value: 0.8431372549019608 } },
	{ index: 162, html: "d70087", hsv: { hue: 322.3255813953488, saturation: 1, value: 0.8431372549019608 } },
	{ index: 163, html: "d700af", hsv: { hue: 311.16279069767444, saturation: 1, value: 0.8431372549019608 } },
	{ index: 164, html: "d700d7", hsv: { hue: 300, saturation: 1, value: 0.8431372549019608 } },
	{ index: 165, html: "d700ff", hsv: { hue: 290.5882352941176, saturation: 1, value: 1 } },
	{ index: 166, html: "d75f00", hsv: { hue: 26.511627906976745, saturation: 1, value: 0.8431372549019608 } },
	{ index: 167, html: "d75f5f", hsv: { hue: 0, saturation: 0.5581395348837209, value: 0.8431372549019608 } },
	{ index: 168, html: "d75f87", hsv: { hue: 340, saturation: 0.5581395348837209, value: 0.8431372549019608 } },
	{ index: 169, html: "d75faf", hsv: { hue: 320, saturation: 0.5581395348837209, value: 0.8431372549019608 } },
	{ index: 170, html: "d75fd7", hsv: { hue: 300, saturation: 0.5581395348837209, value: 0.8431372549019608 } },
	{ index: 171, html: "d75fff", hsv: { hue: 285, saturation: 0.6274509803921569, value: 1 } },
	{ index: 172, html: "d78700", hsv: { hue: 37.674418604651166, saturation: 1, value: 0.8431372549019608 } },
	{ index: 173, html: "d7875f", hsv: { hue: 20, saturation: 0.5581395348837209, value: 0.8431372549019608 } },
	{ index: 174, html: "d78787", hsv: { hue: 0, saturation: 0.37209302325581395, value: 0.8431372549019608 } },
	{ index: 175, html: "d787af", hsv: { hue: 330, saturation: 0.37209302325581395, value: 0.8431372549019608 } },
	{ index: 176, html: "d787d7", hsv: { hue: 300, saturation: 0.37209302325581395, value: 0.8431372549019608 } },
	{ index: 177, html: "d787ff", hsv: { hue: 280, saturation: 0.47058823529411764, value: 1 } },
	{ index: 178, html: "d7af00", hsv: { hue: 48.83720930232558, saturation: 1, value: 0.8431372549019608 } },
	{ index: 179, html: "d7af5f", hsv: { hue: 40, saturation: 0.5581395348837209, value: 0.8431372549019608 } },
	{ index: 180, html: "d7af87", hsv: { hue: 30, saturation: 0.37209302325581395, value: 0.8431372549019608 } },
	{ index: 181, html: "d7afaf", hsv: { hue: 0, saturation: 0.18604651162790697, value: 0.8431372549019608 } },
	{ index: 182, html: "d7afd7", hsv: { hue: 300, saturation: 0.18604651162790697, value: 0.8431372549019608 } },
	{ index: 183, html: "d7afff", hsv: { hue: 270, saturation: 0.3137254901960784, value: 1 } },
	{ index: 184, html: "d7d700", hsv: { hue: 60, saturation: 1, value: 0.8431372549019608 } },
	{ index: 185, html: "d7d75f", hsv: { hue: 60, saturation: 0.5581395348837209, value: 0.8431372549019608 } },
	{ index: 186, html: "d7d787", hsv: { hue: 60, saturation: 0.37209302325581395, value: 0.8431372549019608 } },
	{ index: 187, html: "d7d7af", hsv: { hue: 60, saturation: 0.18604651162790697, value: 0.8431372549019608 } },
	{ index: 188, html: "d7d7d7", hsv: { hue: 0, saturation: 0, value: 0.8431372549019608 } },
	{ index: 189, html: "d7d7ff", hsv: { hue: 240, saturation: 0.1568627450980392, value: 1 } },
	{ index: 190, html: "d7ff00", hsv: { hue: 69.41176470588235, saturation: 1, value: 1 } },
	{ index: 191, html: "d7ff5f", hsv: { hue: 75, saturation: 0.6274509803921569, value: 1 } },
	{ index: 192, html: "d7ff87", hsv: { hue: 80.00000000000001, saturation: 0.47058823529411764, value: 1 } },
	{ index: 193, html: "d7ffaf", hsv: { hue: 90, saturation: 0.3137254901960784, value: 1 } },
	{ index: 194, html: "d7ffd7", hsv: { hue: 120, saturation: 0.1568627450980392, value: 1 } },
	{ index: 195, html: "d7ffff", hsv: { hue: 180, saturation: 0.1568627450980392, value: 1 } },
	{ index: 196, html: "ff0000", hsv: { hue: 0, saturation: 1, value: 1 } },
	{ index: 197, html: "ff005f", hsv: { hue: 337.6470588235294, saturation: 1, value: 1 } },
	{ index: 198, html: "ff0087", hsv: { hue: 328.2352941176471, saturation: 1, value: 1 } },
	{ index: 199, html: "ff00af", hsv: { hue: 318.8235294117647, saturation: 1, value: 1 } },
	{ index: 200, html: "ff00d7", hsv: { hue: 309.4117647058824, saturation: 1, value: 1 } },
	{ index: 201, html: "ff00ff", hsv: { hue: 300, saturation: 1, value: 1 } },
	{ index: 202, html: "ff5f00", hsv: { hue: 22.352941176470587, saturation: 1, value: 1 } },
	{ index: 203, html: "ff5f5f", hsv: { hue: 0, saturation: 0.6274509803921569, value: 1 } },
	{ index: 204, html: "ff5f87", hsv: { hue: 345, saturation: 0.6274509803921569, value: 1 } },
	{ index: 205, html: "ff5faf", hsv: { hue: 330, saturation: 0.6274509803921569, value: 1 } },
	{ index: 206, html: "ff5fd7", hsv: { hue: 315, saturation: 0.6274509803921569, value: 1 } },
	{ index: 207, html: "ff5fff", hsv: { hue: 300, saturation: 0.6274509803921569, value: 1 } },
	{ index: 208, html: "ff8700", hsv: { hue: 31.764705882352942, saturation: 1, value: 1 } },
	{ index: 209, html: "ff875f", hsv: { hue: 15, saturation: 0.6274509803921569, value: 1 } },
	{ index: 210, html: "ff8787", hsv: { hue: 0, saturation: 0.47058823529411764, value: 1 } },
	{ index: 211, html: "ff87af", hsv: { hue: 340, saturation: 0.47058823529411764, value: 1 } },
	{ index: 212, html: "ff87d7", hsv: { hue: 320, saturation: 0.47058823529411764, value: 1 } },
	{ index: 213, html: "ff87ff", hsv: { hue: 300, saturation: 0.47058823529411764, value: 1 } },
	{ index: 214, html: "ffaf00", hsv: { hue: 41.1764705882353, saturation: 1, value: 1 } },
	{ index: 215, html: "ffaf5f", hsv: { hue: 30, saturation: 0.6274509803921569, value: 1 } },
	{ index: 216, html: "ffaf87", hsv: { hue: 20, saturation: 0.47058823529411764, value: 1 } },
	{ index: 217, html: "ffafaf", hsv: { hue: 0, saturation: 0.3137254901960784, value: 1 } },
	{ index: 218, html: "ffafd7", hsv: { hue: 330, saturation: 0.3137254901960784, value: 1 } },
	{ index: 219, html: "ffafff", hsv: { hue: 300, saturation: 0.3137254901960784, value: 1 } },
	{ index: 220, html: "ffd700", hsv: { hue: 50.588235294117645, saturation: 1, value: 1 } },
	{ index: 221, html: "ffd75f", hsv: { hue: 45, saturation: 0.6274509803921569, value: 1 } },
	{ index: 222, html: "ffd787", hsv: { hue: 40, saturation: 0.47058823529411764, value: 1 } },
	{ index: 223, html: "ffd7af", hsv: { hue: 30, saturation: 0.3137254901960784, value: 1 } },
	{ index: 224, html: "ffd7d7", hsv: { hue: 0, saturation: 0.1568627450980392, value: 1 } },
	{ index: 225, html: "ffd7ff", hsv: { hue: 300, saturation: 0.1568627450980392, value: 1 } },
	{ index: 226, html: "ffff00", hsv: { hue: 60, saturation: 1, value: 1 } },
	{ index: 227, html: "ffff5f", hsv: { hue: 60, saturation: 0.6274509803921569, value: 1 } },
	{ index: 228, html: "ffff87", hsv: { hue: 60, saturation: 0.47058823529411764, value: 1 } },
	{ index: 229, html: "ffffaf", hsv: { hue: 60, saturation: 0.3137254901960784, value: 1 } },
	{ index: 230, html: "ffffd7", hsv: { hue: 60, saturation: 0.1568627450980392, value: 1 } },
	{ index: 231, html: "ffffff", hsv: { hue: 0, saturation: 0, value: 1 } },
	{ index: 232, html: "080808", hsv: { hue: 0, saturation: 0, value: 0.03137254901960784 } },
	{ index: 233, html: "121212", hsv: { hue: 0, saturation: 0, value: 0.07058823529411765 } },
	{ index: 234, html: "1c1c1c", hsv: { hue: 0, saturation: 0, value: 0.10980392156862745 } },
	{ index: 235, html: "262626", hsv: { hue: 0, saturation: 0, value: 0.14901960784313725 } },
	{ index: 236, html: "303030", hsv: { hue: 0, saturation: 0, value: 0.18823529411764706 } },
	{ index: 237, html: "3a3a3a", hsv: { hue: 0, saturation: 0, value: 0.22745098039215686 } },
	{ index: 238, html: "444444", hsv: { hue: 0, saturation: 0, value: 0.26666666666666666 } },
	{ index: 239, html: "4e4e4e", hsv: { hue: 0, saturation: 0, value: 0.3058823529411765 } },
	{ index: 240, html: "585858", hsv: { hue: 0, saturation: 0, value: 0.34509803921568627 } },
	{ index: 241, html: "626262", hsv: { hue: 0, saturation: 0, value: 0.3843137254901961 } },
	{ index: 242, html: "6c6c6c", hsv: { hue: 0, saturation: 0, value: 0.4235294117647059 } },
	{ index: 243, html: "767676", hsv: { hue: 0, saturation: 0, value: 0.4627450980392157 } },
	{ index: 244, html: "808080", hsv: { hue: 0, saturation: 0, value: 0.5019607843137255 } },
	{ index: 245, html: "8a8a8a", hsv: { hue: 0, saturation: 0, value: 0.5411764705882353 } },
	{ index: 246, html: "949494", hsv: { hue: 0, saturation: 0, value: 0.5803921568627451 } },
	{ index: 247, html: "9e9e9e", hsv: { hue: 0, saturation: 0, value: 0.6196078431372549 } },
	{ index: 248, html: "a8a8a8", hsv: { hue: 0, saturation: 0, value: 0.6588235294117647 } },
	{ index: 249, html: "b2b2b2", hsv: { hue: 0, saturation: 0, value: 0.6980392156862745 } },
	{ index: 250, html: "bcbcbc", hsv: { hue: 0, saturation: 0, value: 0.7372549019607844 } },
	{ index: 251, html: "c6c6c6", hsv: { hue: 0, saturation: 0, value: 0.7764705882352941 } },
	{ index: 252, html: "d0d0d0", hsv: { hue: 0, saturation: 0, value: 0.8156862745098039 } },
	{ index: 253, html: "dadada", hsv: { hue: 0, saturation: 0, value: 0.8549019607843137 } },
	{ index: 254, html: "e4e4e4", hsv: { hue: 0, saturation: 0, value: 0.8941176470588236 } },
	{ index: 255, html: "eeeeee", hsv: { hue: 0, saturation: 0, value: 0.9333333333333333 } }
]

export const X11ColorNames = [
   ["aliceblue", 15], ["antiquewhite", 224], ["antiquewhite1", 230],
   ["antiquewhite2", 224], ["antiquewhite3", 181], ["antiquewhite4", 8],
   ["aquamarine", 122], ["aquamarine1",  122], ["aquamarine2", 122],
   ["aquamarine3",  79], ["aquamarine4", 66], ["azure", 15],
   ["azure1", 15], ["azure2", 255], ["azure3", 251],
   ["azure4", 102], ["beige", 230], ["bisque", 224],
   ["bisque1", 224], ["bisque2", 223], ["bisque3", 181],
   ["bisque4", 101], ["black", 0], ["blanchedalmond", 224],
   ["blue", 12], ["blue1", 12], ["blue2", 12],
   ["blue3", 20], ["blue4", 18], ["blueviolet", 92],
   ["brown", 124], ["brown1", 203], ["brown2", 203],
   ["brown3", 167], ["brown4", 88], ["burlywood", 180],
   ["burlywood1", 222], ["burlywood2", 222], ["burlywood3", 180],
   ["burlywood4", 95], ["cadetblue", 73], ["cadetblue1", 123],
   ["cadetblue2", 117], ["cadetblue3", 116], ["cadetblue4", 66],
   ["chartreuse", 118], ["chartreuse1", 118], ["chartreuse2", 118],
   ["chartreuse3", 76], ["chartreuse4", 64], ["chocolate", 166],
   ["chocolate1", 208], ["chocolate2", 208], ["chocolate3", 166],
   ["chocolate4", 94], ["coral", 209], ["coral1", 203],
   ["coral2", 203], ["coral3", 167], ["coral4", 94],
   ["cornflowerblue", 69], ["cornsilk", 230], ["cornsilk1", 230],
   ["cornsilk2", 254], ["cornsilk3", 187], ["cornsilk4", 102],
   ["cyan", 14], ["cyan1", 14], ["cyan2", 14],
   ["cyan3", 44], ["cyan4", 30], ["darkblue", 18],
   ["darkcyan", 30], ["darkgoldenrod", 136], ["darkgoldenrod1", 214],
   ["darkgoldenrod2", 214], ["darkgoldenrod3", 172], ["darkgoldenrod4", 94],
   ["darkgray", 248], ["darkgreen", 22], ["darkgrey", 248],
   ["darkkhaki", 143], ["darkmagenta", 90], ["darkolivegreen", 239],
   ["darkolivegreen1", 191], ["darkolivegreen2", 155], ["darkolivegreen3", 149],
   ["darkolivegreen4", 65], ["darkorange", 208], ["darkorange1", 208],
   ["darkorange2", 208], ["darkorange3", 166], ["darkorange4", 94],
   ["darkorchid", 98], ["darkorchid1", 135], ["darkorchid2", 135],
   ["darkorchid3", 98], ["darkorchid4", 54], ["darkred", 88],
   ["darksalmon", 174], ["darkseagreen", 108], ["darkseagreen1", 157],
   ["darkseagreen2", 157], ["darkseagreen3", 114], ["darkseagreen4", 65],
   ["darkslateblue", 60], ["darkslategray", 238], ["darkslategray1", 123],
   ["darkslategray2", 123], ["darkslategray3", 116], ["darkslategray4", 66],
   ["darkslategrey", 238], ["darkturquoise", 44], ["darkviolet", 92],
   ["debianred", 161], ["deeppink", 198], ["deeppink1", 198],
   ["deeppink2", 198], ["deeppink3", 162], ["deeppink4", 89],
   ["deepskyblue", 39], ["deepskyblue1", 39], ["deepskyblue2", 39],
   ["deepskyblue3", 32], ["deepskyblue4", 24], ["dimgrey", 242],
   ["dodgerblue", 33], ["dodgerblue1", 33], ["dodgerblue2", 33],
   ["dodgerblue3", 32], ["dodgerblue4", 24], ["firebrick", 124],
   ["firebrick1", 203], ["firebrick2", 9], ["firebrick3", 160],
   ["firebrick4", 88], ["floralwhite", 15], ["forestgreen", 28],
   ["gainsboro", 253], ["ghostwhite", 15], ["gold", 220],
   ["gold1", 220], ["gold2", 220], ["gold3", 178],
   ["gold4", 3], ["goldenrod", 178], ["goldenrod1", 214],
   ["goldenrod2", 214], ["goldenrod3", 172], ["goldenrod4", 94],
   ["gray", 7], ["gray0", 0], ["gray1", 0],
   ["gray2", 232], ["gray3", 232], ["gray4", 232],
   ["gray5", 232], ["gray6", 233], ["gray7", 233],
   ["gray8", 233], ["gray9", 233], ["gray10", 234],
   ["gray11", 234], ["gray12", 234], ["gray13", 234],
   ["gray14", 235], ["gray15", 235], ["gray16", 235],
   ["gray17", 235], ["gray18", 236], ["gray19", 236],
   ["gray20", 236], ["gray21", 237], ["gray22", 237],
   ["gray23", 237], ["gray24", 237], ["gray25", 238],
   ["gray26", 238], ["gray27", 238], ["gray28", 238],
   ["gray29", 239], ["gray30", 239], ["gray31", 239],
   ["gray32", 239], ["gray33", 240], ["gray34", 240],
   ["gray35", 240], ["gray36", 59], ["gray37", 59],
   ["gray38", 241], ["gray39", 241], ["gray40", 241],
   ["gray41", 242], ["gray42", 242], ["gray43", 242],
   ["gray44", 242], ["gray45", 243], ["gray46", 243],
   ["gray47", 243], ["gray48", 243], ["gray49", 8],
   ["gray50", 8], ["gray51", 8], ["gray52", 102],
   ["gray53", 102], ["gray54", 245], ["gray55", 245],
   ["gray56", 245], ["gray57", 246], ["gray58", 246],
   ["gray59", 246], ["gray60", 246], ["gray61", 247],
   ["gray62", 247], ["gray63", 247], ["gray64", 247],
   ["gray65", 248], ["gray66", 248], ["gray67", 248],
   ["gray68", 145], ["gray69", 145], ["gray70", 249],
   ["gray71", 249], ["gray72", 250], ["gray73", 250],
   ["gray74", 250], ["gray75", 7], ["gray76", 7],
   ["gray77", 251], ["gray78", 251], ["gray79", 251],
   ["gray80", 252], ["gray81", 252], ["gray82", 252],
   ["gray83", 188], ["gray84", 188], ["gray85", 253],
   ["gray86", 253], ["gray87", 253], ["gray88", 254],
   ["gray89", 254], ["gray90", 254], ["gray91", 254],
   ["gray92", 255], ["gray93", 255], ["gray94", 255],
   ["gray95", 255], ["gray96", 255], ["gray97", 15],
   ["gray98", 15], ["gray99", 15], ["gray100", 15],
   ["green", 10], ["green1", 10], ["green2", 10],
   ["green3", 40], ["green4", 28], ["greenyellow", 154],
   ["grey", 7], ["grey0", 0], ["grey1", 0],
   ["grey2", 232], ["grey3", 232], ["grey4", 232],
   ["grey5", 232], ["grey6", 233], ["grey7", 233],
   ["grey8", 233], ["grey9", 233], ["grey10", 234],
   ["grey11", 234], ["grey12", 234], ["grey13", 234],
   ["grey14", 235], ["grey15", 235], ["grey16", 235],
   ["grey17", 235], ["grey18", 236], ["grey19", 236],
   ["grey20", 236], ["grey21", 237], ["grey22", 237],
   ["grey23", 237], ["grey24", 237], ["grey25", 238],
   ["grey26", 238], ["grey27", 238], ["grey28", 238],
   ["grey29", 239], ["grey30", 239], ["grey31", 239],
   ["grey32", 239], ["grey33", 240], ["grey34", 240],
   ["grey35", 240], ["grey36", 59], ["grey37", 59],
   ["grey38", 241], ["grey39", 241], ["grey40", 241],
   ["grey41", 242], ["grey42", 242], ["grey43", 242],
   ["grey44", 242], ["grey45", 243], ["grey46", 243],
   ["grey47", 243], ["grey48", 243], ["grey49", 8],
   ["grey50", 8], ["grey51", 8], ["grey52", 102],
   ["grey53", 102], ["grey54", 245], ["grey55", 245],
   ["grey56", 245], ["grey57", 246], ["grey58", 246],
   ["grey59", 246], ["grey60", 246], ["grey61", 247],
   ["grey62", 247], ["grey63", 247], ["grey64", 247],
   ["grey65", 248], ["grey66", 248], ["grey67", 248],
   ["grey68", 145], ["grey69", 145], ["grey70", 249],
   ["grey71", 249], ["grey72", 250], ["grey73", 250],
   ["grey74", 250], ["grey75", 7], ["grey76", 7],
   ["grey77", 251], ["grey78", 251], ["grey79", 251],
   ["grey80", 252], ["grey81", 252], ["grey82", 252],
   ["grey83", 188], ["grey84", 188], ["grey85", 253],
   ["grey86", 253], ["grey87", 253], ["grey88", 254],
   ["grey89", 254], ["grey90", 254], ["grey91", 254],
   ["grey92", 255], ["grey93", 255], ["grey94", 255],
   ["grey95", 255], ["grey96", 255], ["grey97", 15],
   ["grey98", 15], ["grey99", 15], ["grey100",  231],
   ["honeydew", 255], ["honeydew1", 255],
   ["honeydew2", 254], ["honeydew3", 251], ["honeydew4", 102],
   ["hotpink", 205], ["hotpink1", 205], ["hotpink2", 205],
   ["hotpink3", 168], ["hotpink4", 95], ["indianred", 167],
   ["indianred1", 203], ["indianred2", 203], ["indianred3", 167],
   ["indianred4", 95], ["indigo", 54], ["ivory", 15],
   ["ivory1", 15], ["ivory2", 255], ["ivory3", 251],
   ["ivory4", 102], ["khaki", 222], ["khaki1", 228],
   ["khaki2", 222], ["khaki3", 185], ["khaki4", 101],
   ["lavender", 255], ["lavenderblush", 15], ["lavenderblush1", 15],
   ["lavenderblush2", 254], ["lavenderblush3", 251], ["lavenderblush4", 102],
   ["lawngreen", 118], ["lemonchiffon", 230], ["lemonchiffon1", 230],
   ["lemonchiffon2", 223], ["lemonchiffon3", 187], ["lemonchiffon4", 101],
   ["lightblue", 152], ["lightblue1", 159], ["lightblue2", 153],
   ["lightblue3", 110], ["lightblue4", 66], ["lightcoral", 210],
   ["lightcyan", 195], ["lightcyan1", 195], ["lightcyan2", 254],
   ["lightcyan3", 152], ["lightcyan4", 102], ["lightgoldenrod", 222],
   ["lightgoldenrod1", 228], ["lightgoldenrod2", 222], ["lightgoldenrod3", 179],
   ["lightgoldenrod4", 101], ["lightgoldenrodyellow", 205], ["lightgray", 252],
   ["lightgreen", 120], ["lightgrey", 252], ["lightpink", 217],
   ["lightpink1", 217], ["lightpink2", 217], ["lightpink3", 174],
   ["lightpink4", 95], ["lightsalmon", 216], ["lightsalmon1", 216],
   ["lightsalmon2", 209], ["lightsalmon3", 173], ["lightsalmon4", 95],
   ["lightseagreen", 37], ["lightskyblue", 117], ["lightskyblue1", 153],
   ["lightskyblue2", 153], ["lightskyblue3", 110], ["lightskyblue4", 66],
   ["lightslateblue", 99], ["lightslategrey", 102], ["lightsteelblue", 152],
   ["lightsteelblue1", 189], ["lightsteelblue2", 153], ["lightsteelblue3", 146],
   ["lightsteelblue4", 66], ["lightyellow", 230], ["lightyellow1", 230],
   ["lightyellow2", 254], ["lightyellow3", 187], ["lightyellow4", 102],
   ["limegreen", 77], ["linen", 255], ["magenta", 13],
   ["magenta1", 13], ["magenta2", 13], ["magenta3", 164],
   ["magenta4", 90], ["maroon", 131], ["maroon1", 205],
   ["maroon2", 205], ["maroon3", 162], ["maroon4", 89],
   ["mediumaquamarine", 79], ["mediumblue", 20], ["mediumorchid", 134],
   ["mediumorchid1", 171], ["mediumorchid2", 171], ["mediumorchid3", 134],
   ["mediumorchid4", 96], ["mediumpurple", 98], ["mediumpurple1", 141],
   ["mediumpurple2", 141], ["mediumpurple3", 98], ["mediumpurple4", 60],
   ["mediumseagreen", 71], ["mediumslateblue", 99], ["mediumspringgreen", 48],
   ["mediumturquoise", 80], ["mediumvioletred", 162], ["midnightblue", 4],
   ["mintcream", 15], ["mistyrose", 224], ["mistyrose1", 224],
   ["mistyrose2", 224], ["mistyrose3", 181], ["mistyrose4", 8],
   ["moccasin", 223], ["navajowhite", 223], ["navajowhite1", 223],
   ["navajowhite2", 223], ["navajowhite3", 180], ["navajowhite4", 101],
   ["navy", 4], ["navyblue", 4], ["oldlace", 230],
   ["olivedrab", 64], ["olivedrab1", 155], ["olivedrab2", 155],
   ["olivedrab3", 113], ["olivedrab4", 64], ["orange", 214],
   ["orange1", 214], ["orange2", 208], ["orange3", 172],
   ["orange4", 94], ["orangered", 202], ["orangered1", 202],
   ["orangered2", 202], ["orangered3", 166], ["orangered4", 88],
   ["orchid", 170], ["orchid1", 213], ["orchid2", 212],
   ["orchid3", 170], ["orchid4", 96], ["palegoldenrod", 223],
   ["palegreen", 120], ["palegreen1", 120], ["palegreen2", 120],
   ["palegreen3", 114], ["palegreen4", 65], ["paleturquoise", 159],
   ["paleturquoise1", 159], ["paleturquoise2", 159], ["paleturquoise3", 116],
   ["paleturquoise4", 66], ["palevioletred", 168], ["palevioletred1", 211],
   ["palevioletred2", 211], ["palevioletred3", 168], ["palevioletred4", 95],
   ["papayawhip", 230], ["peachpuff", 223], ["peachpuff1", 223],
   ["peachpuff2", 223], ["peachpuff3", 180], ["peachpuff4", 101],
   ["peru", 173], ["pink", 218], ["pink1", 218],
   ["pink2", 217], ["pink3", 175], ["pink4", 95],
   ["plum", 182], ["plum1", 219], ["plum2", 183],
   ["plum3", 176], ["plum4", 96], ["powderblue", 152],
   ["purple", 129], ["purple1", 99], ["purple2", 93],
   ["purple3", 92], ["purple4", 54], ["red", 9],
   ["red1", 9], ["red2", 9], ["red3", 160],
   ["red4", 88], ["rosybrown", 138], ["rosybrown1", 217],
   ["rosybrown2", 217], ["rosybrown3", 174], ["rosybrown4", 95],
   ["royalblue", 62], ["royalblue1", 69], ["royalblue2", 63],
   ["royalblue3", 62], ["royalblue4", 24], ["saddlebrown", 94],
   ["salmon", 209], ["salmon1", 209], ["salmon2", 209],
   ["salmon3", 167], ["salmon4", 95], ["sandybrown", 215],
   ["seagreen", 29], ["seagreen1", 85], ["seagreen2", 84],
   ["seagreen3", 78], ["seagreen4", 29], ["seashell", 255],
   ["seashell1", 255], ["seashell2", 254], ["seashell3", 251],
   ["seashell4", 102], ["sienna", 130], ["sienna1", 209],
   ["sienna1", 209], ["sienna2", 209], ["sienna3", 167],
   ["sienna4", 94], ["skyblue", 116], ["skyblue1", 117],
   ["skyblue2", 111], ["skyblue3", 74], ["skyblue4", 60],
   ["slateblue", 62], ["slateblue1", 99], ["slateblue2", 99],
   ["slateblue3", 62], ["slateblue4", 60], ["slategray", 66],
   ["slategray1", 189], ["slategray2", 153], ["slategray3", 146],
   ["slategray4", 66], ["slategrey", 66], ["snow", 15],
   ["snow1", 15], ["snow2", 255], ["snow3", 251],
   ["snow4", 245], ["springgreen", 48], ["springgreen1", 48],
   ["springgreen2", 48], ["springgreen3", 41], ["springgreen4", 29],
   ["steelblue", 67], ["steelblue1", 75], ["steelblue2", 75],
   ["steelblue3", 68], ["steelblue4", 60], ["tan", 180],
   ["tan1", 215], ["tan2", 209], ["tan3", 173],
   ["tan4", 94], ["thistle", 182], ["thistle1", 225],
   ["thistle2", 254], ["thistle3", 182], ["thistle4", 102],
   ["tomato", 203], ["tomato1", 203], ["tomato2", 203],
   ["tomato3", 167], ["tomato4", 94], ["turquoise", 80],
   ["turquoise1", 14], ["turquoise2", 45], ["turquoise3", 44],
   ["turquoise4", 30], ["violet", 213], ["violetred", 162],
   ["violetred1", 204], ["violetred2", 204], ["violetred3", 168],
   ["violetred4", 89], ["wheat", 223], ["wheat1", 223],
   ["wheat2", 223], ["wheat3", 180], ["wheat4", 101],
   ["white", 15], ["whitesmoke", 255], ["xterm0", 0],
   ["xterm1", 1], ["xterm2", 2], ["xterm3", 3],
   ["xterm4", 4], ["xterm5", 5], ["xterm6", 6],
   ["xterm7", 7], ["xterm8", 8], ["xterm9", 9],
   ["xterm10", 10], ["xterm11", 11], ["xterm12", 12],
   ["xterm13", 13], ["xterm14", 14], ["xterm15", 15],
   ["xterm16", 16], ["xterm17", 17], ["xterm18", 18],
   ["xterm19", 19], ["xterm20", 20], ["xterm21", 21],
   ["xterm22", 22], ["xterm23", 23], ["xterm24", 24],
   ["xterm25", 25], ["xterm26", 26], ["xterm27", 27],
   ["xterm28", 28], ["xterm29", 29], ["xterm30", 30],
   ["xterm31", 31], ["xterm32", 32], ["xterm33", 33],
   ["xterm34", 34], ["xterm35", 35], ["xterm36", 36],
   ["xterm37", 37], ["xterm38", 38], ["xterm39", 39],
   ["xterm40", 40], ["xterm41", 41], ["xterm42", 42],
   ["xterm43", 43], ["xterm44", 44], ["xterm45", 45],
   ["xterm46", 46], ["xterm47", 47], ["xterm48", 48],
   ["xterm49", 49], ["xterm50", 50], ["xterm51", 51],
   ["xterm52", 52], ["xterm53", 53], ["xterm54", 54],
   ["xterm55", 55], ["xterm56", 56], ["xterm57", 57],
   ["xterm58", 58], ["xterm59", 59], ["xterm60", 60],
   ["xterm61", 61], ["xterm62", 62], ["xterm63", 63],
   ["xterm64", 64], ["xterm65", 65], ["xterm66", 66],
   ["xterm67", 67], ["xterm68", 68], ["xterm69", 69],
   ["xterm70", 70], ["xterm71", 71], ["xterm72", 72],
   ["xterm73", 73], ["xterm74", 74], ["xterm75", 75],
   ["xterm76", 76], ["xterm77", 77], ["xterm78", 78],
   ["xterm79", 79], ["xterm80", 80], ["xterm81", 81],
   ["xterm82", 82], ["xterm83", 83], ["xterm84", 84],
   ["xterm85", 85], ["xterm86", 86], ["xterm87", 87],
   ["xterm88", 88], ["xterm89", 89], ["xterm90", 90],
   ["xterm91", 91], ["xterm92", 92], ["xterm93", 93],
   ["xterm94", 94], ["xterm95", 95], ["xterm96", 96],
   ["xterm97", 97], ["xterm98", 98], ["xterm99", 99],
   ["xterm100", 100], ["xterm101", 101], ["xterm102", 102],
   ["xterm103", 103], ["xterm104", 104], ["xterm105", 105],
   ["xterm106", 106], ["xterm107", 107], ["xterm108", 108],
   ["xterm109", 109], ["xterm110", 110], ["xterm111", 111],
   ["xterm112", 112], ["xterm113", 113], ["xterm114", 114],
   ["xterm115", 115], ["xterm116", 116], ["xterm117", 117],
   ["xterm118", 118], ["xterm119", 119], ["xterm120", 120],
   ["xterm121", 121], ["xterm122", 122], ["xterm123", 123],
   ["xterm124", 124], ["xterm125", 125], ["xterm126", 126],
   ["xterm127", 127], ["xterm128", 128], ["xterm129", 129],
   ["xterm130", 130], ["xterm131", 131], ["xterm132", 132],
   ["xterm133", 133], ["xterm134", 134], ["xterm135", 135],
   ["xterm136", 136], ["xterm137", 137], ["xterm138", 138],
   ["xterm139", 139], ["xterm140", 140], ["xterm141", 141],
   ["xterm142", 142], ["xterm143", 143], ["xterm144", 144],
   ["xterm145", 145], ["xterm146", 146], ["xterm147", 147],
   ["xterm148", 148], ["xterm149", 149], ["xterm150", 150],
   ["xterm151", 151], ["xterm152", 152], ["xterm153", 153],
   ["xterm154", 154], ["xterm155", 155], ["xterm156", 156],
   ["xterm157", 157], ["xterm158", 158], ["xterm159", 159],
   ["xterm160", 160], ["xterm161", 161], ["xterm162", 162],
   ["xterm163", 163], ["xterm164", 164], ["xterm165", 165],
   ["xterm166", 166], ["xterm167", 167], ["xterm168", 168],
   ["xterm169", 169], ["xterm170", 170], ["xterm171", 171],
   ["xterm172", 172], ["xterm173", 173], ["xterm174", 174],
   ["xterm175", 175], ["xterm176", 176], ["xterm177", 177],
   ["xterm178", 178], ["xterm179", 179], ["xterm180", 180],
   ["xterm181", 181], ["xterm182", 182], ["xterm183", 183],
   ["xterm184", 184], ["xterm185", 185], ["xterm186", 186],
   ["xterm187", 187], ["xterm188", 188], ["xterm189", 189],
   ["xterm190", 190], ["xterm191", 191], ["xterm192", 192],
   ["xterm193", 193], ["xterm194", 194], ["xterm195", 195],
   ["xterm196", 196], ["xterm197", 197], ["xterm198", 198],
   ["xterm199", 199], ["xterm200", 200], ["xterm201", 201],
   ["xterm202", 202], ["xterm203", 203], ["xterm204", 204],
   ["xterm205", 205], ["xterm206", 206], ["xterm207", 207],
   ["xterm208", 208], ["xterm209", 209], ["xterm210", 210],
   ["xterm211", 211], ["xterm212", 212], ["xterm213", 213],
   ["xterm214", 214], ["xterm215", 215], ["xterm216", 216],
   ["xterm217", 217], ["xterm218", 218], ["xterm219", 219],
   ["xterm220", 220], ["xterm221", 221], ["xterm222", 222],
   ["xterm223", 223], ["xterm224", 224], ["xterm225", 225],
   ["xterm226", 226], ["xterm227", 227], ["xterm228", 228],
   ["xterm229", 229], ["xterm230", 230], ["xterm231", 231],
   ["xterm232", 232], ["xterm233", 233], ["xterm234", 234],
   ["xterm235", 235], ["xterm236", 236], ["xterm237", 237],
   ["xterm238", 238], ["xterm239", 239], ["xterm240", 240],
   ["xterm241", 241], ["xterm242", 242], ["xterm243", 243],
   ["xterm244", 244], ["xterm245", 245], ["xterm246", 246],
   ["xterm247", 247], ["xterm248", 248], ["xterm249", 249],
   ["xterm250", 250], ["xterm251", 251], ["xterm252", 252],
   ["xterm253", 253], ["xterm254", 254], ["xterm255", 255],
   ["yellow", 11], ["yellow1", 11], ["yellow2", 11],
   ["yellow3", 184], ["yellow4", 100], ["yellowgreen", 113]
]

export const color = {
	x11ToIndex: function(x11Color) {
		const color = X11ColorNames.find(el => el[0] == x11Color)
		if(color) {
			return color[1]
		} else {
			return -1
		}
	},

	htmlToIndex: function(htmlColor) {
	},

	hsvToIndex: function(hsvColor) {
	},

	hsvDistance: function(m, n) {
		const dist =
		       Math.pow(Math.sin(m.hue) * m.saturation * m.value, 2) +
		       Math.pow(Math.sin(n.hue) * n.saturation * n.value, 2) +
		       Math.pow(m.value - n.value, 2)
		return Math.pow(dist, 0.5)
	},

	indexToHTML: function(index) {
		try {
			return XTermColors.find(el => el.index == index).html
		} catch(e) {
			return -1
		}
	},

	htmlToHSV: function(htmlColor) {
		var grab = function(a, b) {
			try {
				return Number("0x" + htmlColor.slice(a,b), 16)
			} catch(e) {
				return false
			}
		}
		const r = grab(0, 2)
		const g = grab(2, 4)
		const b = grab(4, 6)
		if(r === false || g === false|| b === false) {
			return false
		}

		const rprime = r / 255
		const gprime = g / 255
		const bprime = b / 255
		const value = Math.max(rprime, gprime, bprime)
		const min = Math.min(rprime, gprime, bprime)
		const delta = value - min

		const hue = function() {
			const bound = function(num) {
				if(num < 0) {
					return num + 360
				}
				return num
			}

			if(value == 0) {
				return 0
			}
			if(delta == 0) {
				return 0
			}
			if(value == rprime) {
				return bound(60 * ((gprime - bprime) / delta))
			}
			if(value == gprime) {
				return bound(60 * ((bprime - rprime) / delta + 2))
			}
			if(value == bprime) {
				return bound(60 * ((rprime - gprime) / delta + 4))
			}
			return 0
		}()

		const saturation = function() {
			if(value == 0) {
				return 0
			}
			return delta / value
		}()

		return {
			hue: hue,
			saturation: saturation,
			value: value
		}
	}
}
