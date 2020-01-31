"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Communicates with Firestore for a user's devices to control them or read
 * the current state.
 */
const admin = require("firebase-admin");
const config_provider_1 = require("./config-provider");
var serviceAccount = require("./smart-home-key.json");

// firebase.initializeApp({
//   credential: firebase.credential.cert(serviceAccount),
//   databaseURL: "https://safehome-3a492.firebaseio.com"
// });
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${config_provider_1.googleCloudProjectId}.firebaseio.com`,
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
function userExists(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userSnapshot = yield db.ref(`users/${userId}`).once('value');
        console.log("userExists");
        console.log(userSnapshot);
        return userSnapshot ? userSnapshot.val() : null;
    });
}
exports.userExists = userExists;
// export async function getUserId(accessToken: string): Promise<string> {
//   const querySnapshot = await db.collection('users')
//       .where('fakeAccessToken', '==', accessToken).get()
//   if (querySnapshot.empty) {
//     throw new Error('No user found for this access token')
//   }
//   const doc = querySnapshot.docs[0]
//   return doc.id // This is the user id in Firestore
// }
function getUserId(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        var userSnapshot = yield db.ref('users').once('value');
        let rsuser = null;
        let list_user = Object.keys(userSnapshot.val());
        list_user.forEach(user_t => {
            if(userSnapshot.val()[user_t] && userSnapshot.val()[user_t].authcode == accessToken){
               rsuser = user_t;
            }
        })
        if (rsuser) {
            return rsuser;
        }
        throw new Error('No user found for this access token');
    });
}
exports.getUserId = getUserId;
function getUserById(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        var userSnapshot = yield db.ref(`users/${uid}`).once('value');
        return userSnapshot.val();
    });
}
exports.getUserById = getUserById;
function updateAuthCode(userId,code) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatePayload = {};
        updatePayload['authcode'] = code;
        yield db.ref(`users/${userId}`).update(updatePayload);
    });
}
exports.updateAuthCode = updateAuthCode;
function getAuthCode(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        var userSnapshot = yield db.ref(`users/${userId}/authcode`).once('value');
        return userSnapshot.val();
    });
}
exports.getAuthCode = getAuthCode;
function homegraphEnabled(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        //const userDoc = await db.collection('users').doc(userId).get()
        //return userDoc.data()!!.homegraph
        return false;
    });
}
exports.homegraphEnabled = homegraphEnabled;
// export async function setHomegraphEnable(userId: string, enable: boolean) {
//   await db.collection('users').doc(userId).update({
//     homegraph: enable,
//   })
// }
function setHomegraphEnable(userId, enable) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.ref(`users/${userId}`).update({
            homegraph: enable,
        });
    });
}
exports.setHomegraphEnable = setHomegraphEnable;
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
function updateDevice(userId, deviceId, name, nickname, states) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatePayload = {};
        if (name) {
            updatePayload['name'] = name;
        }
        if (nickname) {
            updatePayload['nicknames'] = [nickname];
        }
        if (states) {
            updatePayload['states'] = states;
        }
        yield db.ref(`users/${userId}/devices/${deviceId}`).update(updatePayload);
    });
}
exports.updateDevice = updateDevice;
// export async function addDevice(userId: string,
//     data: ApiClientObjectMap<string | boolean | number>) {
//   await db.collection('users').doc(userId).collection('devices').doc(data.id as string).set(data)
// }
function addDevice(userId, data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.ref(`users/${userId}/devices/${data.id}`).set(data);
    });
}
exports.addDevice = addDevice;
// export async function deleteDevice(userId: string, deviceId: string) {
//   await db.collection('users').doc(userId).collection('devices').doc(deviceId).delete()
// }
function deleteDevice(userId, deviceId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.ref(`users/${userId}/devices`).child(deviceId).remove();
    });
}
exports.deleteDevice = deleteDevice;
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
function getDevices(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const devices = [];
        const querySnapshot = yield db.ref(`users/${userId}/devices`).once('value');
    
         querySnapshot.forEach(doc => {
               const data = doc.val();
               const device = {
                   id: data.id,
                   type: data.type,
                   traits: data.traits,
                   name: {
                       defaultNames: data.defaultNames,
                       name: data.name,
                       nicknames: data.nicknames,
                   },
                   deviceInfo: {
                       manufacturer: data.manufacturer,
                       model: data.model,
                       hwVersion: data.hwVersion,
                       swVersion: data.swVersion,
                   },
                   willReportState: data.willReportState,
                   attributes: data.attributes,
               };
               devices.push(device);
           });
        return devices;
    });
}
exports.getDevices = getDevices;
// export async function getState(userId: string, deviceId: string):
//     Promise<ApiClientObjectMap<string | boolean | number>> {
//   const doc = await db.collection('users').doc(userId)
//     .collection('devices').doc(deviceId).get()
//   if (!doc.exists) {
//     throw new Error('deviceNotFound')
//   }
//   return doc.data()!!.states
// }
function getState(userId, deviceId) {
    return __awaiter(this, void 0, void 0, function* () {
        const querySnapshot = yield db.ref(`users/${userId}/devices/${deviceId}`).once('value');
        console.log(querySnapshot.val()['states']);
        return querySnapshot.val()['states'];
    });
}
exports.getState = getState;
function execute(userId, deviceId, execution) {
    return __awaiter(this, void 0, void 0, function* () {
        const querySnapshot = yield db.ref(`users/${userId}/devices/${deviceId}`).once('value');

        if (!querySnapshot.val()) {
            throw new Error('deviceNotFound')
        }

        const states = {
            online: true,
        }
        const data = querySnapshot.val()
    console.log(data);
    console.log(execution);
        if (!data["states"].online) {
            throw new Error('deviceOffline')
        }
        switch (execution.command) {
            case 'action.devices.commands.ArmDisarm':
              if (execution.params.arm !== undefined) {
                states.isArmed = execution.params.arm
              } else if (execution.params.cancel) {
                // Cancel value is in relation to the arm value
                states.isArmed != data["states"].isArmed
              }
              if (execution.params.armLevel) {
                yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                    'states.isArmed': states.isArmed || data["states"].isArmed,
                    'states.currentArmLevel': execution.params.armLevel,
                });
                states['currentArmLevel'] = execution.params.armLevel
              } else {
                yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                  'states.isArmed': states.isArmed || data["states"].isArmed,
                })
              }
              break

            // action.devices.traits.Brightness
            case 'action.devices.commands.BrightnessAbsolute':
              yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                'states.brightness': execution.params.brightness,
              })
              states['brightness'] = execution.params.brightness
              break

            // action.devices.traits.CameraStream
            case 'action.devices.commands.GetCameraStream':
              states['cameraStreamAccessUrl'] = 'https://fluffysheep.com/baaaaa.mp4'
              break

            // action.devices.traits.ColorSetting
            case 'action.devices.commands.ColorAbsolute':
              let color = {}
              if (execution.params.color.spectrumRGB) {
                yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                  'states.color': {
                    spectrumRgb: execution.params.color.spectrumRGB,
                  },
                })
                color = {
                  spectrumRgb: execution.params.color.spectrumRGB,
                }
              } else if (execution.params.color.spectrumHSV) {
                yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                  'states.color': {
                    spectrumHsv: execution.params.color.spectrumHSV,
                  },
                })
                color = {
                  spectrumHsv: execution.params.color.spectrumHSV,
                }
              } else if (execution.params.color.temperature) {
                yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                  'states.color': {
                    temperatureK: execution.params.color.temperature,
                  },
                })
                color = {
                  temperatureK: execution.params.color.temperature,
                }
              } else {
                throw new Error('notSupported')
              }
              states['color'] = color
              break

            // action.devices.traits.Dock
            case 'action.devices.commands.Dock':
              // This has no parameters
              yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                'states.isDocked': true,
              })
              states['isDocked'] = true
              break

            // action.devices.traits.FanSpeed
            case 'action.devices.commands.SetFanSpeed':
              yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                'states.currentFanSpeedSetting': execution.params.fanSpeed,
              })
              states['currentFanSpeedSetting'] = execution.params.fanSpeed
              break

            case 'action.devices.commands.Reverse':
              yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                'states.currentFanSpeedReverse': true,
              })
              break

            // action.devices.traits.Locator
            case 'action.devices.commands.Locate':
              yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                'states.silent': execution.params.silent,
                'states.generatedAlert': true,
              })
              states['generatedAlert'] = true
              break

            // action.devices.traits.LockUnlock
            case 'action.devices.commands.LockUnlock':
              yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                'states.isLocked': execution.params.lock,
              })
              states['isLocked'] = execution.params.lock
              break

            // action.devices.traits.Modes
            case 'action.devices.commands.SetModes':
        let currentModeSettings = {};
        for (const mode of Object.keys(execution.params.updateModeSettings)) {
          const setting = execution.params.updateModeSettings[mode]
          currentModeSettings[mode] = setting
        }
        yield db.ref(`users/${userId}/devices/${deviceId}`).update({
          'states.currentModeSettings': currentModeSettings,
        })
        states['currentModeSettings'] = currentModeSettings
        break

            // action.devices.traits.OnOff
            case 'action.devices.commands.OnOff':
              yield db.ref(`users/${userId}/devices/${deviceId}/states`).update({
                'on': execution.params.on,
              })
              states['on'] = execution.params.on
              break

            // action.devices.traits.OpenClose
            case 'action.devices.commands.OpenClose':
              // Check if the device can open in multiple directions
                if (data['attributes'] && data['attributes'].openDirection) {
                    // The device can open in more than one direction
                    const direction = execution.params.openDirection
                    data["states"].openState.forEach(state => {
                        if (state.openDirection === direction) {
                            state.openPercent = execution.params.openPercent
                        }
                    })
                yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                    'states.openState': data["states"].openState,
                })
                } else {
                    // The device can only open in one direction
                    yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                        'states.openPercent': execution.params.openPercent,
                    })
                    states['openPercent'] = execution.params.openPercent
                }
                break

            // action.devices.traits.RunCycle - No execution
            // action.devices.traits.Scene
            case 'action.devices.commands.ActivateScene':
              yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                'states.deactivate': execution.params.deactivate,
              })
              // Scenes are stateless
              break

            // action.devices.traits.StartStop
            case 'action.devices.commands.StartStop':
              yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                'states.isRunning': execution.params.start,
              })
              states['isRunning'] = execution.params.start
              states['isPaused'] = data["states"].isPaused
              break

            case 'action.devices.commands.PauseUnpause':
              yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                'states.isPaused': execution.params.pause,
              })
              states['isPaused'] = execution.params.pause
              states['isRunning'] = data["states"].isRunning
              break

            // action.devices.traits.TemperatureControl
            case 'action.devices.commands.SetTemperature':
              yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                'states.temperatureSetpointCelsius': execution.params.temperature,
              })
              states['temperatureSetpointCelsius'] = execution.params.temperature
              states['temperatureAmbientCelsius'] = data["states"].temperatureAmbientCelsius
              break

            // action.devices.traits.TemperatureSetting
            case 'action.devices.commands.ThermostatTemperatureSetpoint':
              yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                'states.thermostatTemperatureSetpoint': execution.params.thermostatTemperatureSetpoint,
              })
              states['thermostatTemperatureSetpoint'] = execution.params.thermostatTemperatureSetpoint
              states['thermostatMode'] = data["states"].thermostatMode
              states['thermostatTemperatureAmbient'] = data["states"].thermostatTemperatureAmbient
              states['thermostatHumidityAmbient'] = data["states"].thermostatHumidityAmbient
              break

            case 'action.devices.commands.ThermostatTemperatureSetRange':
              const {
                thermostatTemperatureSetpointLow,
                thermostatTemperatureSetpointHigh,
              } = execution.params
              yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                'states.thermostatTemperatureSetpointLow': thermostatTemperatureSetpointLow,
                'states.thermostatTemperatureSetpointHigh': thermostatTemperatureSetpointHigh,
              })
              states['thermostatTemperatureSetpoint'] = data["states"].thermostatTemperatureSetpoint
              states['thermostatMode'] = data["states"].thermostatMode
              states['thermostatTemperatureAmbient'] = data["states"].thermostatTemperatureAmbient
              states['thermostatHumidityAmbient'] = data["states"].thermostatHumidityAmbient
              break

            case 'action.devices.commands.ThermostatSetMode':
              yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                'states.thermostatMode': execution.params.thermostatMode,
              })
              states['thermostatMode'] = execution.params.thermostatMode
              states['thermostatTemperatureSetpoint'] = data["states"].thermostatTemperatureSetpoint
              states['thermostatTemperatureAmbient'] = data["states"].thermostatTemperatureAmbient
              states['thermostatHumidityAmbient'] = data["states"].thermostatHumidityAmbient
              break

            // action.devices.traits.Timer
            case 'action.devices.commands.TimerStart':
              yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                'states.timerRemainingSec': execution.params.timerTimeSec,
              })
              states['timerRemainingSec'] = execution.params.timerTimeSec
              break

            case 'action.devices.commands.TimerAdjust':
              if (data["states"].timerRemainingSec === -1) {
                // No timer exists
                throw new Error('noTimerExists')
              }
              const newTimerRemainingSec = data["states"].timerRemainingSec + execution.params.timerTimeSec
              if (newTimerRemainingSec < 0) {
                throw new Error('valueOutOfRange')
              }
              yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                'states.timerRemainingSec': newTimerRemainingSec,
              })
              states['timerRemainingSec'] = newTimerRemainingSec
              break

            case 'action.devices.commands.TimerPause':
              if (data["states"].timerRemainingSec === -1) {
                // No timer exists
                throw new Error('noTimerExists')
              }
              yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                'states.timerPaused': true,
              })
              states['timerPaused'] = true
              break

            case 'action.devices.commands.TimerResume':
              if (data["states"].timerRemainingSec === -1) {
                // No timer exists
                throw new Error('noTimerExists')
              }
              yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                'states.timerPaused': false,
              })
              states['timerPaused'] = false
              break

            case 'action.devices.commands.TimerCancel':
              if (data["states"].timerRemainingSec === -1) {
                // No timer exists
                throw new Error('noTimerExists')
              }
              yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                'states.timerRemainingSec': -1,
              })
              states['timerRemainingSec'] = 0
              break

            // action.devices.traits.Toggles
            case 'action.devices.commands.SetToggles':
              let currentToggleSettings = {};
              for (const toggle of Object.keys(execution.params.updateToggleSettings)) {
                const enable = execution.params.updateToggleSettings[toggle]
                currentToggleSettings[toggle] = enable
              }
              yield db.ref(`users/${userId}/devices/${deviceId}`).update({
                'states.currentToggleSettings': currentToggleSettings,
              })
              states['currentToggleSettings'] = currentToggleSettings
              break

            default:
              throw new Error('actionNotAvailable')
          }

          return states
    });
}
exports.execute = execute;
function disconnect(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield setHomegraphEnable(userId, false);
    });
}
exports.disconnect = disconnect;
//# sourceMappingURL=firestore.js.map