import { generateId } from '@hiber3d/hdk-core';
import {
  HDKComponent,
  HNode,
  Prefab,
  render,
  InfoPanel,
  CapacitorSensor,
  VisibleOnSignal,
  AndGate,
} from '@hiber3d/hdk-react';
import { Ground, Spawnpoint } from '@hiber3d/hdk-react-components';

const Collectible: HDKComponent<{ outputSignal: number }> = ({
  outputSignal,
  ...props
}) => {
  const collectSignal = generateId();
  return (
    <>
      <Prefab
        id="collectible_mandatory_key_01"
        engineId={collectSignal}
        {...props}
        engineProps={{
          signalSource: {},
          collisionSensor: {},
          colliderIsSensor: {},
          collider: {
            canGenerateEvent: true,
          },
        }}
      />
      <CapacitorSensor
        input={collectSignal} // take the signal from the collectible
        output={outputSignal} // send the signal to the world
        delayInSeconds={9999999} // Sustain the signal for a long time
      />
    </>
  );
};

const Goal: HDKComponent<{ outputSignal: number; keySignals: number[] }> = ({
  outputSignal,
  keySignals,
  ...props
}) => {
  const inGoalSignal = generateId();
  const collectedAllKeys = generateId();
  const finishedGame = generateId();
  return (
    <HNode>
      <Prefab
        engineId={inGoalSignal}
        id="goal_01"
        {...props}
        engineProps={{
          signalSource: {},
          collider: {
            canGenerateEvent: true,
          },
          colliderIsSensor: {},
          collisionSensor: {},
        }}
      />
      <AndGate inputs={keySignals} output={collectedAllKeys} />

      <AndGate
        inputs={[collectedAllKeys, inGoalSignal]}
        output={finishedGame}
      />
      <CapacitorSensor
        input={finishedGame}
        output={outputSignal}
        delayInSeconds={9999999}
      />
    </HNode>
  );
};

const World = () => {
  const collectSignal1 = generateId();
  const collectSignal2 = generateId();
  const winnerSignal = generateId();
  return (
    <HNode>
      <Ground />
      <Spawnpoint />
      <Collectible z={5} x={3} outputSignal={collectSignal1} />
      <Collectible z={5} x={-3} outputSignal={collectSignal2} />
      <Goal
        z={10}
        outputSignal={winnerSignal}
        keySignals={[collectSignal1, collectSignal2]}
      />

      <VisibleOnSignal input={winnerSignal}>
        <Prefab id="cube_01" />
        <Prefab id="fx_particlesystem_fireworks_01" />
      </VisibleOnSignal>
    </HNode>
  );
};

/**
 * Render an almost empty world
 */
render(<World />, { environment: 'sunrise_01' });
