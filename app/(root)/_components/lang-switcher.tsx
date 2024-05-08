'use client';

export function LangSwitcher() {
  return (
    <form className="mx-auto max-w-sm">
      <select
        id="countries"
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      >
        <option value="EN" selected>EN</option>
        <option value="RU">RU</option>
        <option value="CA">CA</option>
        <option value="FR">FR</option>
        <option value="DE">DE</option>
      </select>
    </form>
  );
}
