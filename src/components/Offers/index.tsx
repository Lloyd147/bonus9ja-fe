'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINT } from '@/lib/constants';
import TabCard, { Offer } from '../TabCards';
import { removeCookie } from '@/lib/cookies';
import InfiniteScroll from 'react-infinite-scroll-component';

interface OffersProps {
  initialOffers: Offer[];
}

const Offers = ({ initialOffers }: OffersProps) => {
  const [offers, setOffers] = useState(initialOffers);

  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(initialOffers?.length >= 99);
  const pageSize = 100;

  const loadMoreOffers = () => {
    setPageNumber(pageNumber + 1);
  };

  useEffect(() => {
    if (pageNumber > 1)
      axios
        .get(`${API_ENDPOINT}/offers`, {
          params: {
            pageNumber,
            pageSize
          }
        })
        .then((response: { data: { offers: Offer[] } }) => {
          const newOffers = response?.data?.offers;

          if (newOffers.length === 0) {
            setHasMore(false);
          } else {
            setOffers([...offers, ...newOffers] as any);
          }
        })
        .catch((error: any) => {
          console.error('Error fetching offers:', error);
        });
  }, [pageNumber]);

  return (
    <InfiniteScroll
      dataLength={offers.length}
      next={loadMoreOffers}
      hasMore={hasMore}
      loader={
        <div className="loader-gif">
          <img src="/images/loading.gif" alt="" />
        </div>
      }
    >
      {offers?.length > 0 && offers?.map((data, index) => <TabCard data={data} key={index} data-index={index} />)}
    </InfiniteScroll>
  );
};

export default Offers;
