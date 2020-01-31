/* Copyright 2018, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Communicates with Firestore for a user's devices to control them or read
 * the current state.
 */

import * as admin from 'firebase-admin'
import { SmartHomeV1SyncDevices, SmartHomeV1ExecuteRequestExecution } from 'actions-on-google'
import { ApiClientObjectMap } from 'actions-on-google/dist/common'
import {googleCloudProjectId} from './config-provider'

//var serviceAccount = require("./smart-home-key.json");

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${googleCloudProjectId}.firebaseio.com`,
});
//const db = admin.firestore();
const db = admin.database();
//const ref = db.ref("users");
// const settings = { timestampsInSnapshots: true };
// db.settings(settings);

// export async function userExists(userId: string): Promise<boolean> {
//   const userDoc = await db.collection('users').doc(userId).get()
//   return userDoc.exists
// }
export async function userExists(userId: string): Promise<boolean> {
    const userSnapshot = await db.ref(`users/${userId}`).once('value');
  console.log("userExists");
  console.log(userSnapshot);
  return userSnapshot ? userSnapshot.val() : null;
}

// export async function getUserId(accessToken: string): Promise<string> {
//   const querySnapshot = await db.collection('users')
//       .where('fakeAccessToken', '==', accessToken).get()
//   if (querySnapshot.empty) {
//     throw new Error('No user found for this access token')
//   }
//   const doc = querySnapshot.docs[0]
//   return doc.id // This is the user id in Firestore
// }
export async function getUserId(accessToken: string): Promise<string> {
    var userSnapshot = await db.ref('users').once('value');
    let rsuser = null;
    console.log(userSnapshot.val());
    // userSnapshot.val().forEach(user_t => {
    //     console.log(user_t);
    //     //if(user_t.fakeAccessToken == 'accessToken'){
    //     //    rsuser = user_t;
    //     //}
    // });
    if(rsuser){
        return Object.keys(rsuser)[0];
    }
    throw new Error('No user found for this access token');
}

export async function homegraphEnabled(userId: string): Promise<boolean> {
  //const userDoc = await db.collection('users').doc(userId).get()
  //return userDoc.data()!!.homegraph
  return false;
}

// export async function setHomegraphEnable(userId: string, enable: boolean) {
//   await db.collection('users').doc(userId).update({
//     homegraph: enable,
//   })
// }
export async function setHomegraphEnable(userId: string, enable: boolean) {
  await db.ref(`users/${userId}`).update({
            homegraph: enable,
        });
}

// export async function updateDevice(userId: string, deviceId: string,
//     name: string, nickname: string, states: ApiClientObjectMap<string | boolean | number>) {

//   // Payload can contain any state data
//   // tslint:disable-next-line
//   const updatePayload: {[key: string]: any} = {}
//   if (name) {
//     updatePayload['name'] = name
//   }
//   if (nickname) {
//     updatePayload['nicknames'] = [nickname]
//   }
//   if (states) {
//     updatePayload['states'] = states
//   }
//   await db.collection('users').doc(userId).collection('devices').doc(deviceId)
//     .update(updatePayload)
// }
export async function updateDevice(userId: string, deviceId: string,
    name: string, nickname: string, states: ApiClientObjectMap<string | boolean | number>) {

    const updatePayload: {[key: string]: any} = {}
    if (name) {
        updatePayload['name'] = name;
    }
    if (nickname) {
        updatePayload['nicknames'] = [nickname];
    }
    if (states) {
        updatePayload['states'] = states;
    }
    await db.ref(`users/${userId}/devices/${deviceId}`).update(updatePayload);
}

// export async function addDevice(userId: string,
//     data: ApiClientObjectMap<string | boolean | number>) {
//   await db.collection('users').doc(userId).collection('devices').doc(data.id as string).set(data)
// }
export async function addDevice(userId: string,
    data: ApiClientObjectMap<string | boolean | number>) {
  await db.ref(`users/${userId}/devices/${data.id}`).set(data);
}

// export async function deleteDevice(userId: string, deviceId: string) {
//   await db.collection('users').doc(userId).collection('devices').doc(deviceId).delete()
// }
export async function deleteDevice(userId: string, deviceId: string) {
  await db.ref(`users/${userId}/devices`).child(deviceId).remove();
}

// export async function getDevices(userId: string): Promise<SmartHomeV1SyncDevices[]> {
//   const devices: SmartHomeV1SyncDevices[] = []
//   const querySnapshot = await db.collection('users').doc(userId).collection('devices').get()

//   querySnapshot.forEach(doc => {
//     const data = doc.data()
//     const device: SmartHomeV1SyncDevices = {
//       id: data.id,
//       type: data.type,
//       traits: data.traits,
//       name: {
//         defaultNames: data.defaultNames,
//         name: data.name,
//         nicknames: data.nicknames,
//       },
//       deviceInfo: {
//         manufacturer: data.manufacturer,
//         model: data.model,
//         hwVersion: data.hwVersion,
//         swVersion: data.swVersion,
//       },
//       willReportState: data.willReportState,
//       attributes: data.attributes,
//     }
//     devices.push(device)
//   })

//   return devices
// }
export async function getDevices(userId: string): Promise<SmartHomeV1SyncDevices[]> {
    const devices: SmartHomeV1SyncDevices[] = []
    //const querySnapshot = await db.ref(`users/${userId}/devices`).once('value');
    // querySnapshot.val().forEach(doc => {
  //       const data = doc.data();
  //       const device = {
  //           id: data.id,
  //           type: data.type,
  //           traits: data.traits,
  //           name: {
  //               defaultNames: data.defaultNames,
  //               name: data.name,
  //               nicknames: data.nicknames,
  //           },
  //           deviceInfo: {
  //               manufacturer: data.manufacturer,
  //               model: data.model,
  //               hwVersion: data.hwVersion,
  //               swVersion: data.swVersion,
  //           },
  //           willReportState: data.willReportState,
  //           attributes: data.attributes,
  //       };
  //       devices.push(device);
  //   });
    return devices;
}

// export async function getState(userId: string, deviceId: string):
//     Promise<ApiClientObjectMap<string | boolean | number>> {

//   const doc = await db.collection('users').doc(userId)
//     .collection('devices').doc(deviceId).get()

//   if (!doc.exists) {
//     throw new Error('deviceNotFound')
//   }

//   return doc.data()!!.states
// }
export async function getState(userId: string, deviceId: string):
    Promise<string> {

    const querySnapshot = await db.ref(`users/${userId}/devices${deviceId}`).once('value');
    console.log(querySnapshot);
    //console.log(querySnapshot[states]);
    //return querySnapshot[states];
    return 'tt';
}
// Payload can contain any state data
// tslint:disable-next-line
type StatesMap = ApiClientObjectMap<any>

export async function execute(userId: string, deviceId: string,
    execution: SmartHomeV1ExecuteRequestExecution):
    Promise<StatesMap> {
    let aaa: StatesMap = {
      name: 12
    };
    return aaa
}

export async function disconnect(userId: string) {
  await setHomegraphEnable(userId, false)
}
