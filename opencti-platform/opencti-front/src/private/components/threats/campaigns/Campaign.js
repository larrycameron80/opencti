import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import inject18n from '../../../../components/i18n';
import CampaignOverview from './CampaignOverview';
import CampaignDetails from './CampaignDetails';
import CampaignEdition from './CampaignEdition';
import CampaignPopover from './CampaignPopover';
import EntityLastReports from '../../reports/EntityLastReports';
import EntityStixRelationsDonut from '../../common/stix_relations/EntityStixRelationsDonut';
import EntityReportsChart from '../../reports/EntityReportsChart';
import EntityIncidentsChart from '../incidents/EntityIncidentsChart';
import StixDomainEntityHeader from '../../common/stix_domain_entities/StixDomainEntityHeader';

const styles = () => ({
  container: {
    margin: 0,
  },
  gridContainer: {
    marginBottom: 20,
  },
});

class CampaignComponent extends Component {
  render() {
    const { classes, campaign } = this.props;
    return (
      <div className={classes.container}>
        <StixDomainEntityHeader
          stixDomainEntity={campaign}
          PopoverComponent={<CampaignPopover />}
        />
        <Grid
          container={true}
          spacing={3}
          classes={{ container: classes.gridContainer }}
        >
          <Grid item={true} xs={3}>
            <CampaignOverview campaign={campaign} />
          </Grid>
          <Grid item={true} xs={3}>
            <CampaignDetails campaign={campaign} />
          </Grid>
          <Grid item={true} xs={6}>
            <EntityLastReports entityId={campaign.id} />
          </Grid>
        </Grid>
        <Grid
          container={true}
          spacing={3}
          classes={{ container: classes.gridContainer }}
          style={{ marginTop: 30 }}
        >
          <Grid item={true} xs={4}>
            <EntityIncidentsChart entityId={campaign.id} />
          </Grid>
          <Grid item={true} xs={4}>
            <EntityStixRelationsDonut
              entityId={campaign.id}
              entityType="Stix-Observable"
              relationType="indicates"
              field="entity_type"
            />
          </Grid>
          <Grid item={true} xs={4}>
            <EntityReportsChart entityId={campaign.id} />
          </Grid>
        </Grid>
        <CampaignEdition campaignId={campaign.id} />
      </div>
    );
  }
}

CampaignComponent.propTypes = {
  campaign: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
};

const Campaign = createFragmentContainer(CampaignComponent, {
  campaign: graphql`
    fragment Campaign_campaign on Campaign {
      id
      name
      alias
      ...CampaignOverview_campaign
      ...CampaignDetails_campaign
    }
  `,
});

export default compose(
  inject18n,
  withStyles(styles),
)(Campaign);
