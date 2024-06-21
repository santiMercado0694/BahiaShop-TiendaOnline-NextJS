import { useState } from "react";
import { useGlobalContext } from "@/context/StoreProvider";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

interface SearchBarProps {
  setSearch: (value: string) => void;
  getProductsByCategory: (id: string) => void;
  setPaginationPage: (page: number) => void;
  actualPage: number;
}

const SearchBar = ({
  setSearch,
  getProductsByCategory,
  setPaginationPage,
  actualPage,
}: SearchBarProps) => {
  const { categories, loading } = useGlobalContext();
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setSearch(e.target.value);
    setPaginationPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    if (actualPage !== 1) {
      setPaginationPage(1);
    }
    setSearchText("");
    setSearch("");
    getProductsByCategory(categoryId);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-center space-x-4">
        <div className="flex-1 max-w-48">
          <label htmlFor="search" className="sr-only">
            Buscar
          </label>
          <input
            type="text"
            id="search"
            name="search"
            value={searchText}
            onChange={handleSearchChange}
            className="block w-full pl-3 pr-10 py-2 text-base bg-gray-200 border border-gray-300 text-gray-700 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm rounded-md"
            placeholder="Buscar producto"
          />
        </div>
        <div className="flex-1 max-w-64">
          <label htmlFor="categories" className="sr-only">
            Categorías
          </label>
          <select
            id="categories"
            name="categories"
            onChange={handleCategoryChange}
            className="block w-full pl-3 pr-10 py-2 text-base bg-gray-200 border border-gray-300 text-gray-700 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">Todas las categorías</option>
            {categories
              .filter((category) => category.nombre !== "Sin categoria")
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nombre}
                </option>
              ))}
          </select>
        </div>
      </div>
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={1000}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
