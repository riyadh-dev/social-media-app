import { useEffect, useState } from 'react';
import { Snapshot, useGotoRecoilSnapshot, useRecoilSnapshot } from 'recoil';

function TimeTravelObserver() {
	const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

	const snapshot = useRecoilSnapshot();
	useEffect(() => {
		if (snapshots.every((s) => s.getID() !== snapshot.getID())) {
			setSnapshots([...snapshots, snapshot]);
		}
	}, [snapshot, snapshots]);

	const gotoSnapshot = useGotoRecoilSnapshot();

	return (
		<ol
			style={{
				position: 'fixed',
				cursor: 'pointer',
				right: 12,
				bottom: 0,
				zIndex: 99999,
				opacity: 1,
			}}
		>
			{snapshots.map((snapshot, i) => (
				<li key={i}>
					Snapshot {i}
					<button onClick={() => gotoSnapshot(snapshot)}>Restore</button>
				</li>
			))}
		</ol>
	);
}

export default TimeTravelObserver;
