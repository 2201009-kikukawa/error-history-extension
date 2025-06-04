// error-sample.ts

// 1. 型エラー: string型の変数にnumberを代入しようとしています
let userName: string = "Suzuki";
userName = 12345; // Error: Type 'number' is not assignable to type 'string'.

// 2. 未定義の変数を参照しようとしています
const userAge = 30;
console.log(userAg); // Error: Cannot find name 'userAg'. Did you mean 'userAge'?

// 3. 存在しないプロパティにアクセスしようとしています
interface UserProfile {
  id: number;
  name: string;
}

const userProfile: UserProfile = {
  id: 1,
  name: "Yamada",
};
console.log(userProfile.email); // Error: Property 'email' does not exist on type 'UserProfile'.

// 4. 関数の引数の型が一致していません
function greet(name: string, age: number): string {
  return `Hello, ${name}! You are ${age} years old.`;
}

greet("Tanaka", "forty"); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.

 const incompleteObject = {
   key1: "value1",
   key2: // Error: Expression expected.
 };

function oldFunction(param1) {
  // Error (if tsconfig noImplicitAny is true): Parameter 'param1' implicitly has an 'any' type.
  console.log(param1.nonExistentMethod()); // Runtime error if param1 doesn't have this, compile error if type is known and doesn't have it
}

oldFunction(new Date());

const something: number = "This will also be an error"; // Type 'string' is not assignable to type 'number'.