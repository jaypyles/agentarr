import type { AgentLog } from '$lib/types';
import { persisted } from 'svelte-persisted-store';

const agentLog: AgentLog = {
	series: [],
	movie: [],
	management: []
};

type Agent = 'series' | 'movie' | 'management';

const base = persisted<AgentLog>('agent-log', agentLog);

function addLog(agent: Agent, log: any) {
	base.update((s) => {
		s[agent].push(log);
		return s;
	});
}

function clearLog(agent: Agent) {
	base.update((s) => {
		if (agent === 'series') {
			s.series = [];
		} else if (agent === 'movie') {
			s.movie = [];
		} else if (agent === 'management') {
			s.management = [];
		}
		return s;
	});
}

export const agentLogStore = {
	...base,
	addLog,
	clearLog
};
