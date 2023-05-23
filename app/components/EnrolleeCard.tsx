import {
  Flex,
  VStack,
  Divider,
  Card,
  CardBody,
  CardFooter,
  Heading,
} from '@chakra-ui/react';
import { CompletedRequirementsList } from './CompletedRequirementsList';

type EnrolleeProps = {
  enrollee: string;
  enrollment: string;
  certification: string;
};

export const EnrolleeCard = (props: EnrolleeProps) => {
  return (
    <Card variant='outline' maxW={640} mb={4}>
      <CardBody>
        <Flex>
          <VStack flex='1' align='flex-start'>
            <Heading as='h2' size='md'>
              {props.enrollee}
            </Heading>
          </VStack>
        </Flex>
      </CardBody>
      <Divider />
      <CardFooter width='100%'>
        <VStack align='flex-start' width='100%'>
          <Heading as='h3' size='sm' mb={2}>
            Completed Requirements:
          </Heading>
          <CompletedRequirementsList
            enrollee={props.enrollee}
            enrollment={props.enrollment}
            certification={props.certification.toString()}
          />
        </VStack>
      </CardFooter>
    </Card>
  );
};
