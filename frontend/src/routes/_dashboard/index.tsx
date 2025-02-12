import { createFileRoute } from '@tanstack/react-router'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { 
  Box, 
  Grid, 
  Heading, 
  SimpleGrid, 
  HStack,
  Badge,
  Stat 
} from '@chakra-ui/react'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// Mock data
const monthlyData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Sales',
      data: [12500, 15000, 17500, 16000, 19000, 22000],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
  ],
}

const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [65000, 75000, 85000, 82000, 95000, 110000],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

export const Route = createFileRoute('/_dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Box p={6}>
      <Heading mb={6}>Dashboard</Heading>
      
      {/* Key Metrics */}
      <SimpleGrid columns={{ base: 1, md: 4 }} gap={6} mb={8}>
        <Stat.Root p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg">
          <Stat.Label>Total Sales</Stat.Label>
          <HStack>
            <Stat.ValueText>
              {formatCurrency(102000)}
            </Stat.ValueText>
            <Badge colorScheme="green">
              <Stat.UpIndicator />
              15%
            </Badge>
          </HStack>
          <Stat.HelpText>compared to last month</Stat.HelpText>
        </Stat.Root>

        <Stat.Root p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg">
          <Stat.Label>Revenue</Stat.Label>
          <HStack>
            <Stat.ValueText>
              {formatCurrency(512000)}
            </Stat.ValueText>
            <Badge colorScheme="green">
              <Stat.UpIndicator />
              12%
            </Badge>
          </HStack>
          <Stat.HelpText>compared to last month</Stat.HelpText>
        </Stat.Root>

        <Stat.Root p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg">
          <Stat.Label>Orders</Stat.Label>
          <HStack>
            <Stat.ValueText>1,234</Stat.ValueText>
            <Badge colorScheme="red">
              <Stat.DownIndicator />
              5%
            </Badge>
          </HStack>
          <Stat.HelpText>since last week</Stat.HelpText>
        </Stat.Root>

        <Stat.Root p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="lg">
          <Stat.Label>Customers</Stat.Label>
          <HStack>
            <Stat.ValueText>890</Stat.ValueText>
            <Badge colorScheme="green">
              <Stat.UpIndicator />
              8%
            </Badge>
          </HStack>
          <Stat.HelpText>new this month</Stat.HelpText>
        </Stat.Root>
      </SimpleGrid>

      {/* Charts */}
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
        <Box p={6} shadow="lg" border="1px" borderColor="gray.200" borderRadius="lg">
          <Heading size="md" mb={4}>Monthly Sales Trend</Heading>
          <Line data={monthlyData} options={options} />
        </Box>
        <Box p={6} shadow="lg" border="1px" borderColor="gray.200" borderRadius="lg">
          <Heading size="md" mb={4}>Revenue Overview</Heading>
          <Bar data={revenueData} options={options} />
        </Box>
      </Grid>
    </Box>
  )
}
