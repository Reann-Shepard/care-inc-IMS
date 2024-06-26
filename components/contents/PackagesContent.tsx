'use client';
import Link from 'next/link';
// import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef, use } from 'react';
import ListTable from '@/components/tables/ListTable';
import SortByBtn from '@/components/buttons/SortByBtn';
import FilterBtn from '@/components/buttons/FilterBtn';
import { Package } from '@/entities/Package';
import { OrderCustomer } from '@/entities/OrderCustomer';
import { getAllPackages } from '@/services/package/getPackage';
import { getAllOrderCustomers } from '@/services/orderCustomer/getOrderCustomer';
import { useRouter } from 'next/navigation';

export default function PackagesContent() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [orderCustomers, setOrderCustomers] = useState<OrderCustomer[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});
  const [sortedData, setSortedData] = useState<
    (string | number | Date | null)[][]
  >([]);

  const dataColumnName = [
    'id',
    'clientId',
    'fittingDate',
    'warrantyExpiration',
    'orderDate',
    'comments',
  ];
  const [sortBy, setSortBy] = useState<string>(dataColumnName[0]);

  const handleSortBy = (sortBy: string) => {
    setSortBy(sortBy);
  };

  useEffect(() => {
    //fetch data from database
    const fetchPackagesData = async () => {
      try {
        if (sortBy != 'orderDate') {
          getAllPackages(sortBy).then((data) => {
            setPackages(data);
          });
          console.log(packages);
        }
      } catch (error) {
        console.log('Failed fetching Package data', error);
      }
      try {
        getAllOrderCustomers().then((data) => {
          setOrderCustomers(data);
        });
        console.log(orderCustomers);
      } catch (error) {
        console.log('Failed fetching OrderCustomer data', error);
      }
    };
    fetchPackagesData();
  }, [sortBy]);

  // for displaying
  const header = [
    'Package ID',
    'Client ID',
    'Fitting Date',
    'Warranty Expiration',
    'Order Date',
    'Comments',
  ];

  // find sortBy value in header to get the index for displaying
  const sortByIndex = dataColumnName.findIndex((item) => item === sortBy);

  // for filter categories
  // const filterHeader = ['Company', 'Model', 'Color'];
  // const filterHeader = ['Client ID', 'Order Customer ID'];
  const filterHeaderIndexes = [0, 3];
  // for filter categories' title
  const filterHeader = filterHeaderIndexes.map((index) => header[index]);

  // !!@TODO: filter functionality is not working
  // for filter data
  const handlerFilter = (selectedBoxes: { [key: string]: string[] }) => {
    setSelectedFilters(selectedBoxes);
  };

  // useEffect(() => {
  //   // filter data
  //   const filterPackages = (packages: Package[], selectedFilters: { [key: string]: string[] }) => {
  //     return packages.filter((eachPackage) => {
  //       return Object.keys(selectedFilters).every((key) => {
  //         return selectedFilters[key].length === 0 || selectedFilters[key].includes(eachPackage[key as keyof Package]);
  //       });
  //     });
  //   };
  //   const sortedPackages = (col: keyof Package) => {
  //     return [...filteredPackages].sort((a, b) => a[col].localeCompare(b[col]));
  //   };
  //   setFilteredPackages(filterPackages(packages, selectedFilters));
  // }
  // , [selectedFilters]);

  const toDate = (date: string | Date): string => {
    if (typeof date === 'string') {
      return date.split('T')[0];
    } else if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    } else {
      throw new Error('Invalid date format.');
    }
  };

  // for data in ListTable
  const data = packages.map((eachPackage) => {
    const orderCustomerDate = orderCustomers.find(
      (orderCustomer) => orderCustomer.id === eachPackage.clientId,
    );
    const orderDate = orderCustomerDate
      ? toDate(orderCustomerDate.orderDate)
      : '';
    return [
      eachPackage.id,
      eachPackage.clientId,
      toDate(eachPackage.fittingDate),
      toDate(eachPackage.warrantyExpiration),
      orderDate,
      eachPackage.comments,
    ];
  });
  console.log(data);

  useEffect(() => {
    if (sortBy == 'orderDate') {
      const result = [...data].sort((a, b) => {
        const dateA = a[4] ? a[4].toString() : '';
        const dateB = b[4] ? b[4].toString() : '';
        return dateA.localeCompare(dateB);
      });
      setSortedData(result);
    }
  }, [sortBy]);

  const handleRowClick = (row: (string | number | Date | null)[]) => {
    const packageId = row[0];
    if (packageId) {
      router.push(`/packages/package_id?package_id=${packageId.toString()}`);
    }
  };

  return (
    <div>
      <div className="flex m-10 justify-between">
        <div className="flex items-center">
          <SortByBtn
            dataColumnTitles={header}
            dataColumnNames={dataColumnName}
            value={header[sortByIndex]}
            onSortBy={handleSortBy}
          />
          <FilterBtn
            dataColumnIndexes={filterHeaderIndexes}
            dataColumnNames={filterHeader}
            data={data}
            onFilter={handlerFilter}
          />
        </div>
        <Link
          href="/packages/add_package"
          className="btn px-10 font-bold text-white bg-[#54CE50]"
        >
          +
        </Link>
      </div>
      <div className="overflow-x-auto">
        <ListTable
          header={header}
          data={sortBy === 'orderDate' ? sortedData : data}
          onClick={handleRowClick}
        />
      </div>
    </div>
  );
}
