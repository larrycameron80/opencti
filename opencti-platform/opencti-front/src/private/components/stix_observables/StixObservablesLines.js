import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { createPaginationContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { pathOr } from 'ramda';
import ListLinesContent from '../../../components/list_lines/ListLinesContent';
import {
  StixObservableLine,
  StixObservableLineDummy,
} from './StixObservableLine';

const nbOfRowsToLoad = 25;

class StixObservablesLines extends Component {
  render() {
    const { initialLoading, dataColumns, relay } = this.props;
    return (
      <ListLinesContent
        initialLoading={initialLoading}
        loadMore={relay.loadMore.bind(this)}
        hasMore={relay.hasMore.bind(this)}
        isLoading={relay.isLoading.bind(this)}
        dataList={pathOr([], ['stixObservables', 'edges'], this.props.data)}
        globalCount={pathOr(
          nbOfRowsToLoad,
          ['stixObservables', 'pageInfo', 'globalCount'],
          this.props.data,
        )}
        LineComponent={<StixObservableLine />}
        DummyLineComponent={<StixObservableLineDummy />}
        dataColumns={dataColumns}
        nbOfRowsToLoad={nbOfRowsToLoad}
      />
    );
  }
}

StixObservablesLines.propTypes = {
  classes: PropTypes.object,
  paginationOptions: PropTypes.object,
  dataColumns: PropTypes.object.isRequired,
  data: PropTypes.object,
  relay: PropTypes.object,
  stixObservables: PropTypes.object,
  initialLoading: PropTypes.bool,
};

export const stixObservablesLinesQuery = graphql`
  query StixObservablesLinesPaginationQuery(
    $types: [String]
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: StixObservablesOrdering
    $orderMode: OrderingMode
  ) {
    ...StixObservablesLines_data
      @arguments(
        types: $types
        search: $search
        count: $count
        cursor: $cursor
        orderBy: $orderBy
        orderMode: $orderMode
      )
  }
`;

export const stixObservablesLinesSearchQuery = graphql`
  query StixObservablesLinesSearchQuery($search: String) {
    stixObservables(search: $search) {
      edges {
        node {
          id
          entity_type
          observable_value
          created_at
          updated_at
        }
      }
    }
  }
`;

export default createPaginationContainer(
  StixObservablesLines,
  {
    data: graphql`
      fragment StixObservablesLines_data on Query
        @argumentDefinitions(
          types: { type: "[String]" }
          search: { type: "String" }
          count: { type: "Int", defaultValue: 25 }
          cursor: { type: "ID" }
          orderBy: {
            type: "StixObservablesOrdering"
            defaultValue: "observable_value"
          }
          orderMode: { type: "OrderingMode", defaultValue: "asc" }
        ) {
        stixObservables(
          types: $types
          search: $search
          first: $count
          after: $cursor
          orderBy: $orderBy
          orderMode: $orderMode
        ) @connection(key: "Pagination_stixObservables") {
          edges {
            node {
              id
              entity_type
              observable_value
              first_seen
              last_seen
              created_at
              markingDefinitions {
                edges {
                  node {
                    id
                    definition
                  }
                }
              }
              ...StixObservableLine_node
            }
          }
          pageInfo {
            endCursor
            hasNextPage
            globalCount
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.data && props.data.stixObservables;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        types: fragmentVariables.types,
        search: fragmentVariables.search,
        count,
        cursor,
        orderBy: fragmentVariables.orderBy,
        orderMode: fragmentVariables.orderMode,
      };
    },
    query: stixObservablesLinesQuery,
  },
);
