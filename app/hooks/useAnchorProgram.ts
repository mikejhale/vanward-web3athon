import { Program, AnchorProvider } from '@coral-xyz/anchor';
import idl from '../idl/vanward-idl.json';

// @todo: pass in IDL
const useAnchorProgram = (provider: AnchorProvider) => {
  const idl_string = JSON.stringify(idl);
  const idl_object = JSON.parse(idl_string);
  const program = new Program(idl_object, idl.metadata.address, provider);

  return program as Program;
};

export default useAnchorProgram;
