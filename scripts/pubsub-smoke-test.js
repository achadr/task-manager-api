// Smoke test for the local Pub/Sub emulator (jalon J2, bloc 2).
// Creates the topic task.created and a subscription "notif" if they do not exist,
// publishes one message, then waits up to 10 s to receive it.
// Run it in a throwaway container on the compose network, with PUBSUB_EMULATOR_HOST set.
const { PubSub } = require('@google-cloud/pubsub');

const projectId = process.env.PUBSUB_PROJECT_ID || 'task-manager-local';
const pubsub = new PubSub({ projectId });

async function getOrCreateTopic(name) {
  const topic = pubsub.topic(name);
  const [exists] = await topic.exists();
  if (!exists) await topic.create();
  console.log(`topic ${name} : ${exists ? 'existait déjà' : 'créé'}`);
  return topic;
}

async function getOrCreateSubscription(topic, name) {
  const sub = pubsub.subscription(name);
  const [exists] = await sub.exists();
  if (!exists) await topic.createSubscription(name);
  console.log(`subscription ${name} : ${exists ? 'existait déjà' : 'créée'}`);
  return pubsub.subscription(name);
}

(async () => {
  console.log(`émulateur visé : ${process.env.PUBSUB_EMULATOR_HOST || '(aucun : le VRAI Pub/Sub serait visé)'}`);
  const topic = await getOrCreateTopic('task.created');
  const sub = await getOrCreateSubscription(topic, 'notif');

  const payload = JSON.stringify({ event: 'task.created', id: `smoke-${Date.now()}` });
  const messageId = await topic.publishMessage({ data: Buffer.from(payload) });
  console.log(`publié : ${payload} (messageId ${messageId})`);

  const timer = setTimeout(() => {
    console.log('rien reçu en 10 s');
    process.exit(1);
  }, 10000);

  sub.on('message', (message) => {
    console.log(`reçu par notif : ${message.data.toString()}`);
    message.ack();
    clearTimeout(timer);
    sub.close().then(() => process.exit(0));
  });
  sub.on('error', (err) => {
    console.error(`erreur de la subscription : ${err.message}`);
    process.exit(1);
  });
})().catch((err) => {
  console.error(`échec : ${err.message}`);
  process.exit(1);
});
