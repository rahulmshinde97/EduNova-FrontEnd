import React, { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Sidebar, Navbar } from '../components/Layout';
import AddMemberModal from '../components/AddMemberModal';
import MemberDetailsModal from '../components/MemberDetailModal';
import { v4 as uuidv4 } from 'uuid';

const initialData = [];

const roles = ['Product Designer', 'Product Manager', 'Frontend Developer', 'Backend Developer'];
const teams = [
    { name: 'Design', color: 'text-blue-500' },
    { name: 'Product', color: 'text-sky-500' },
    { name: 'Marketing', color: 'text-purple-500' },
    { name: 'Technology', color: 'text-green-500' }
];

export default function PeopleDirectory() {
    const [data, setData] = useState(initialData);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(true);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [filterType, setFilterType] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const filteredData = useMemo(() => {
        return data.filter(person => {
            const roleMatch = selectedRole ? person.role === selectedRole : true;
            const teamsMatch = selectedTeams.length ? selectedTeams.every(team => person.teams.includes(team)) : true;
            const searchMatch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) || person.email.toLowerCase().includes(searchQuery.toLowerCase());
            return roleMatch && teamsMatch && searchMatch;
        });
    }, [data, selectedRole, selectedTeams, searchQuery]);

    const columns = useMemo(
        () => [
            {
                id: 'col_1',
                header: 'Profile',
                accessorKey: 'profilePhoto',
                cell: ({ row }) => (
                    <div className="flex items-center space-x-2">
                        <img
                            src={row.original.profilePhoto || 'https://via.placeholder.com/50'}
                            alt={row.original.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    </div>
                ),
            },
            {
                id: 'col_2',
                header: 'Name',
                accessorKey: 'name',
                cell: ({ cell }) => <span className="text-sm">{cell.getValue()}</span>,
            },
            {
                id: 'col_3',
                header: 'Status',
                accessorKey: 'status',
                cell: ({ cell }) => (
                    <span className="flex items-center text-sm">
                        <span
                            className={`w-2.5 h-2.5 rounded-full mr-2 ${cell.getValue() === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`}
                        />
                        {cell.getValue()}
                    </span>
                ),
            },
            {
                id: 'col_4',
                header: 'Role',
                accessorKey: 'role',
                cell: ({ cell }) => <span className="text-sm">{cell.getValue()}</span>,
            },
            {
                id: 'col_5',
                header: 'Email',
                accessorKey: 'email',
                cell: ({ cell }) => <span className="text-sm">{cell.getValue()}</span>,
            },
            {
                id: 'col_6',
                header: 'Teams',
                accessorKey: 'teams',
                cell: ({ row }) => (
                    <span className="text-sm">
                        {row.original.teams.map(teamName => {
                            const team = teams.find(t => t.name === teamName);
                            return (
                                <span key={teamName} className={`${team?.color} mr-2`}>
                                    {teamName}
                                </span>
                            );
                        })}
                    </span>
                ),
            },
            {
                id: 'col_actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(row.original);
                            }}
                            className="text-blue-500 text-sm"
                        >
                            ✎
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(row.original.id);
                            }}
                            className="text-red-500 text-sm"
                        >
                            ✘
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    const tableInstance = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const { getHeaderGroups, getRowModel } = tableInstance;

    function handleEdit(person) {
        setSelectedPerson(person);
        setIsAddingNew(false);
        setIsModalOpen(true);
    }

    function handleDelete(id) {
        setData(data.filter(person => person.id !== id));
    }

    function handleRowClick(person) {
        setSelectedPerson(person);
        setIsDetailsModalOpen(true);
    }

    const handleModalSubmit = (values) => {
        const emailExists = data.some(
            (person) => person.email === values.email && person.id !== (selectedPerson?.id || '')
        );

        if (emailExists) {
            alert('This email is already in use. Please use a different email.');
            return;
        }

        if (selectedPerson) {
            setData(data.map(person =>
                person.id === selectedPerson.id ? { ...selectedPerson, ...values } : person
            ));
        } else {
            setData([...data, { id: uuidv4(), ...values }]);
        }
        setSelectedPerson(null);
        setIsModalOpen(false);
        setIsAddingNew(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />
            <div className="flex-1 p-6">
                <Navbar />
                <div className="mt-8">
                    <div className="flex justify-end items-center mb-4">
                        <div className="flex space-x-4 ">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="p-1 border text-sm w-48"
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            <button
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setSelectedPerson(null);
                                    setIsAddingNew(true);
                                }}
                                className="bg-blue-500 text-white p-2 rounded text-sm"
                            >
                                Add Member
                            </button>
                            <div className="relative">
                                <button
                                    className="bg-gray-300 text-black p-2 rounded text-sm"
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                >
                                    Filters
                                </button>
                                {isFilterOpen && (
                                    <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg w-64 text-sm">
                                        <div className="p-4">
                                            <button
                                                className={`block w-full text-left p-2 ${filterType === 'roles' ? 'bg-gray-200' : ''}`}
                                                onClick={() => setFilterType('roles')}
                                            >
                                                Role
                                            </button>
                                            <button
                                                className={`block w-full text-left p-2 ${filterType === 'teams' ? 'bg-gray-200' : ''}`}
                                                onClick={() => setFilterType('teams')}
                                            >
                                                Teams
                                            </button>
                                        </div>
                                        {filterType === 'roles' && (
                                            <div className="p-4">
                                                {roles.map(role => (
                                                    <label key={role} className="block text-sm">
                                                        <input
                                                            type="radio"
                                                            name="role"
                                                            value={role}
                                                            checked={selectedRole === role}
                                                            onChange={() => setSelectedRole(role)}
                                                            className="mr-2"
                                                        />
                                                        <span>{role}</span>
                                                    </label>
                                                ))}
                                                <label className="block text-sm">
                                                    <input
                                                        type="radio"
                                                        name="role"
                                                        value=""
                                                        checked={selectedRole === ''}
                                                        onChange={() => setSelectedRole('')}
                                                        className="mr-2"
                                                    />
                                                    <span>All Roles</span>
                                                </label>
                                            </div>
                                        )}
                                        {filterType === 'teams' && (
                                            <div className="p-4">
                                                {teams.map(team => (
                                                    <label key={team.name} className="block text-sm">
                                                        <input
                                                            type="checkbox"
                                                            value={team.name}
                                                            checked={selectedTeams.includes(team.name)}
                                                            onChange={(e) => {
                                                                const { checked, value } = e.target;
                                                                setSelectedTeams(prevTeams =>
                                                                    checked ? [...prevTeams, value] : prevTeams.filter(t => t !== value)
                                                                );
                                                            }}
                                                            className="mr-2"
                                                        />
                                                        <span className={team.color}>{team.name}</span>
                                                    </label>
                                                ))}
                                                <label className="block text-sm">
                                                    <input
                                                        type="checkbox"
                                                        value=""
                                                        checked={selectedTeams.length === 0}
                                                        onChange={() => setSelectedTeams([])}
                                                        className="mr-2"
                                                    />
                                                    <span>All Teams</span>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <table className="w-full bg-white shadow-md rounded">
                        <thead className="bg-gray-200">
                            {getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="p-4 text-sm">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {getRowModel().rows.map(row => (
                                <tr
                                    key={row.id}
                                    className="border-b hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleRowClick(row.original)} // Add onClick handler for row
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="p-4 text-sm">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <AddMemberModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={isAddingNew ? null : selectedPerson}
            />
            <MemberDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                person={selectedPerson}
            />
        </div>
    );
}
