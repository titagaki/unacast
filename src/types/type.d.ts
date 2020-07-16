type UserComment = {
  /** レス番号 */
  number?: string;
  /** 名前 */
  name: string;
  /** 日付 */
  date?: string;
  /** コメント */
  text: string;
  /** アイコン画像 */
  imgUrl: string;
  threadTitle?: string;
  id?: string;
  email?: string;
};

type CommentSocketMessage = {
  type: 'add' | 'reset';
  message: string;
};

type ArrayItem<T extends any[]> = T extends (infer Titem)[] ? Titem : never;
type ResolvedType<T> = T extends Promise<infer R> ? R : T;
type GeneratorType<T extends (...args: any) => any> = ResolvedType<ReturnType<T>>;
