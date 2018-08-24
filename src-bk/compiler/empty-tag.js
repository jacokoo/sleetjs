import { TagCompiler } from './tag';

export class EmptyTagCompiler extends TagCompiler {
    selfClosing () { return true; }
}
