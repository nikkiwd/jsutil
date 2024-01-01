import axios from "axios";

const useragent = "wikibase.js/0.1 (https://www.wikidata.org/wiki/User:Nikki)";

export function is_valid_eid(eid) {
	if (eid && eid.match(/^E[1-9][0-9]*$/))
		return true;
	return false;
}

export function is_valid_fid(fid) {
	if (fid && fid.match(/^L[1-9][0-9]*-F[1-9][0-9]*$/))
		return true;
	return false;
}

export function is_valid_lid(lid) {
	if (lid && lid.match(/^L[1-9][0-9]*$/))
		return true;
	return false;
}

export function is_valid_mid(mid) {
	if (mid && mid.match(/^M[1-9][0-9]*$/))
		return true;
	return false;
}

export function is_valid_pid(pid) {
	if (pid && pid.match(/^P[1-9][0-9]*$/))
		return true;
	return false;
}

export function is_valid_qid(qid) {
	if (qid && qid.match(/^Q[1-9][0-9]*$/))
		return true;
	return false;
}

export function is_valid_sid(sid) {
	if (sid && sid.match(/^L[1-9][0-9]*-S[1-9][0-9]*$/))
		return true;
	return false;
}

export function is_valid_zid(zid) {
	if (sid && sid.match(/^Z[1-9][0-9]*$/))
		return true;
	return false;
}

export function is_valid_llid(llid) {
	return is_valid_qid(llid);
}

export async function sparql_query(query) {
	const queryurl = "https://query.wikidata.org/sparql?format=json&query=" + encodeURI(query);
	const res = await axios.get(queryurl, { headers: { "User-Agent": useragent } });
	return res.data.results.bindings;
}

export function make_date_statement(p, date) {
	if (!is_valid_pid(p))
		return null;
	if (!date.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/))
		return null;

	let statement = {
		"mainsnak": {
			"snaktype": "value",
			"property": p,
			"datavalue": {
				"value": {
					"time": `+${date}T00:00:00Z`,
					"timezone": 0,
					"before": 0,
					"after": 0,
					"precision": 11,
					"calendarmodel": "http://www.wikidata.org/entity/Q1985727"
				},
				"type": "time"
			}
		},
		"type": "statement",
		"rank": "normal"
	};
	return statement;
}

export function make_item_statement(p, qid) {
	if (!is_valid_pid(p))
		return null;
	if (!is_valid_qid(qid))
		return null;

	let statement = {
			"mainsnak": {
				"snaktype": "value",
				"property": p,
				"datavalue": {
					"value": {
						"entity-type": "item",
						"id": qid
					},
					"type": "wikibase-entityid"
				}
			},
			"type": "statement",
			"rank": "normal"
		};
	return statement;
}

export function make_monolingual_text_statement(p, text, lang) {
	if (!is_valid_pid(p))
		return null;
	if (!is_valid_monolingual_text_language(lang))
		return null;
	if (!text)
		return null;

	let statement = {
		"mainsnak": {
			"snaktype": "value",
			"property": p,
			"datavalue": {
				"value": {
					"text": text,
					"language": lang
				},
				"type": "monolingualtext"
			}
		},
		"type": "statement",
		"rank": "normal"
	};
	return statement;
}

export function make_string_statement(p, text) {
	if (!is_valid_pid(p))
		return null;
	if (!text)
		return null;

	let statement = {
		"mainsnak": {
			"snaktype": "value",
			"property": p,
			"datavalue": {
				"value": text,
				"type": "string"
			}
		},
		"type": "statement",
		"rank": "normal"
	};
	return statement;
}

export function make_form(representations) {
	let form = {
		"add": "",
		"representations": {},
		"claims": {},
	};

	for (const r of representations) {
		// if not valid lexeme language return null

		form.representations[r.language] = {
			"language": r.language,
			"value": r.value,
		};
	}

	return form;
}

export function make_lexeme(langqid, lexcat, lemmas) {
	let lexeme = {
		"language": langqid,
		"lemmas": {},
		"lexicalCategory": lexcat,
		"forms": [],
		"senses": [],
	};

	for (const lemma of lemmas) {
		lexeme.lemmas[lemma.language] = {
			language: lemma.language,
			value: lemma.value,
		}
	}

	return lexeme;
}

export function make_sense(glosses) {
	let sense = {
		"add": "",
		"glosses": {},
		"claims": {},
	};

	for (const gloss of glosses) {
		// if not valid gloss language return null

		sense.glosses[gloss.language] = {
			"language": gloss.language,
			"value": gloss.value,
		};
	}

	return sense;
}
