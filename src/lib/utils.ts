import { Abi } from "viem";
import { ITonStakingContractsInfo , IContractInfo} from "../type";
import {  } from "../configs/constants";

export const formatAddress = (addr: string | undefined) => {
  if (!addr || addr.length < 10) {
    throw new Error("Invalid wallet address");
  }
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

export const getAbis = (originals: Array<any> | Abi, values: Array<string> ) : Abi  | Array<any> => {

  if (!originals) {
    // throw new Error("Invalid originals");
    return [];
  }
  const jsonArray: Array<any> = []

  for(let i=0 ; i< originals.length; i++) {
    for(let j = 0; j < values.length ; j++) {
      if(originals[i].name == values[j]) {
        jsonArray.push({
          inputs: originals[i].inputs,
          name: originals[i].name,
          outputs:  originals[i].outputs,
          stateMutability:  originals[i].stateMutability,
          type:  originals[i].type,
        })
      }
    }
  }
  return jsonArray;
};

export const getContractInfo = (inputs: ITonStakingContractsInfo, name: string) : IContractInfo | undefined => {

  if (!inputs) {
    // throw new Error("Invalid originals");
    return ;
  }

  const jsonObj: { [key: string]: any } = inputs;
  for (const key in jsonObj) {
    if (!jsonObj.hasOwnProperty(key)) {
      continue;
    }
    // console.log("key",key); // Key
    // console.log("Value",jsonObj[key]); // Value
    if(key == name) return jsonObj[key]
  }
}
