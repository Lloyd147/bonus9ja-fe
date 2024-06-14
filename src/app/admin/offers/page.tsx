'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Table from '@/components/Table/index';
import { Offer } from '@/components/TabCards/index';
import { getCookie } from '@/lib/cookies';
import { API_ENDPOINT } from '@/lib/constants';
import FormContainer from '@/components/FormContainer';
import { useDispatch } from 'react-redux';
import { getBookies } from '@/lib/utils';
import { setBookies } from '@/redux/features/bookiesSlice';

const AdminOffers = () => {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState('');
  const [addNew, setAddNew] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filterOffer, setFilterOffer] = useState<Offer>();
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const token = getCookie('token') && JSON.parse(getCookie('token') as any);
  const { push } = useRouter();
  const pageSize = 100;
  const loadMoreOffers = () => {
    setPageNumber(pageNumber + 1);
  };

  useEffect(() => {
    const bookies = getBookies(offers);
    dispatch(setBookies(bookies));
  }, [offers]);

  useEffect(() => {
    if (!token && typeof window !== 'undefined') {
      push('/admin/login');
    }
  }, []);

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      axios
        .get(`${API_ENDPOINT}/offers`, {
          params: {
            pageNumber,
            pageSize,
            disabled: true
          }
        })
        .then((response: { data: { offers: Offer[] } }) => {
          const newOffers = response?.data?.offers;

          if (newOffers.length === 0) {
            setHasMore(false);
          } else {
            setOffers([...offers, ...newOffers] as any);
          }
          setIsLoading(false);
        })
        .catch((error: any) => {
          console.error('Error fetching offers:', error);
          setIsLoading(false);
        });
    }
  }, [pageNumber]);

  const handleEdit = (id: string) => {
    if (id) {
      setAddNew(true);
      const filteredOffers = offers?.find((offer) => offer?._id === id);
      setFilterOffer(filteredOffers);
    }
  };

  return (
    <>
      {token && (
        <>
          {addNew ? (
            <>
              <FormContainer
                setIsOpen={setAddNew}
                setFilterOffer={setFilterOffer}
                filterOffer={filterOffer!}
                selectedId={selectedId}
                setOffers={setOffers}
                offers={offers}
                setSelectedId={setSelectedId}
              />
            </>
          ) : (
            <>
              <div className="wrapper">
                <div className="button-row">
                  <h1>All Bookies</h1>
                  <button
                    onClick={() => {
                      selectedId == '' && setAddNew(true);
                    }}
                  >
                    Add New
                  </button>
                </div>
              </div>
              <div className="table-data">
                <Table
                  offers={offers}
                  isLoading={isLoading}
                  loadMoreOffers={loadMoreOffers}
                  hasMore={hasMore}
                  setOffers={setOffers}
                  setSelectedId={setSelectedId}
                  selectedId={selectedId}
                  handleEdit={handleEdit}
                />
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default AdminOffers;
